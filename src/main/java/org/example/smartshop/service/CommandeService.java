package org.example.smartshop.service;

import org.example.smartshop.dto.request.CommandeRequest;
import org.example.smartshop.dto.request.CommandeLigneRequest;
import org.example.smartshop.dto.response.CommandeResponse;
import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.mapper.CommandeMapper;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.CommandeLigne;
import org.example.smartshop.model.Customer;
import org.example.smartshop.model.Product;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.model.enums.CustomerTier;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.CustomerRepository;
import org.example.smartshop.repository.ProductRepository;
import org.example.smartshop.service.auto.AutoCommandeProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CommandeMapper commandeMapper;

    @Autowired
    private AutoCommandeProcessor autoCommandeProcessor;

    // créer commande
    @Transactional
    public CommandeResponse creerCommande(CommandeRequest request) {

        validateCommandeRequest(request);

        Customer customer = findCustomer(request.getCustomerId());

        validatePromoUsage(request.getCodePromo(), customer.getId());

        List<CommandeLigne> lignes = buildLignesCommande(request);

        boolean stockDisponible = autoCommandeProcessor.verifierStock(lignes);

        Commande commande = initialiserCommande(customer, request.getCodePromo(), lignes, stockDisponible);

        if (stockDisponible) {
            autoCommandeProcessor.calculerMontants(commande, customer);
        } else {
            initialiserMontantsAZero(commande);
        }

        commandeRepository.save(commande);

        return commandeMapper.toResponse(commande);
    }

    // aide interne
    private void validateCommandeRequest(CommandeRequest request) {
        if (request.getCustomerId() == null) {
            throw new ValidationException("Une commande doit être associée à un client");
        }

        if (request.getLignes() == null || request.getLignes().isEmpty()) {
            throw new ValidationException("Une commande doit contenir au moins un article");
        }
    }

    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
    }

    private void validatePromoUsage(String codePromo, Long customerId) {
        if (codePromo == null || codePromo.isBlank()) {
            return;
        }

        boolean dejaUtilise = commandeRepository
                .existsByCustomerIdAndCodePromo(customerId, codePromo);

        if (dejaUtilise) {
            throw new BusinessRuleException("Vous avez déjà utilisé ce code promo");
        }
    }

    private List<CommandeLigne> buildLignesCommande(CommandeRequest request) {
        return request.getLignes().stream()
                .map(this::buildLigne)
                .toList();
    }

    private CommandeLigne buildLigne(CommandeLigneRequest ligneRequest) {
        if (ligneRequest.getQuantite() == null || ligneRequest.getQuantite() <= 0) {
            throw new BusinessRuleException(
                    "La quantité doit être strictement supérieure à 0 pour le produit " + ligneRequest.getProductId()
            );
        }

        Product product = productRepository.findByIdAndNotDeleted(ligneRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé : " + ligneRequest.getProductId()));

        CommandeLigne ligne = CommandeLigne.builder()
                .product(product)
                .quantite(ligneRequest.getQuantite())
                .prixUnitaire(product.getPrixUnitaire())
                .build();

        ligne.calculerTotal();
        return ligne;
    }

    private Commande initialiserCommande(Customer customer, String codePromo, List<CommandeLigne> lignes, boolean stockDisponible) {

        CommandeStatut statutInitial = stockDisponible ? CommandeStatut.PENDING : CommandeStatut.REJECTED;

        Commande commande = Commande.builder()
                .customer(customer)
                .statut(statutInitial)
                .codePromo(codePromo)
                .build();

        for (CommandeLigne ligne : lignes) {
            ligne.setCommande(commande);
            commande.getLignes().add(ligne);
        }

        return commande;
    }

    private void initialiserMontantsAZero(Commande commande) {
        commande.setSousTotal(BigDecimal.ZERO);
        commande.setRemisePromo(BigDecimal.ZERO);
        commande.setRemiseFidelite(BigDecimal.ZERO);
        commande.setMontantRemiseTotal(BigDecimal.ZERO);
        commande.setMontantHTApresRemise(BigDecimal.ZERO);
        commande.setTva(BigDecimal.ZERO);
        commande.setTotalTTC(BigDecimal.ZERO);
        commande.setMontantRestant(BigDecimal.ZERO);
    }

    // get commande by id
    @Transactional(readOnly = true)
    public CommandeResponse getCommandeById(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        return commandeMapper.toResponse(commande);
    }

   // consulte historique
    @Transactional(readOnly = true)
    public List<CommandeResponse> getCommandesByCustomer(Long customerId) {
        List<Commande> commandes = commandeRepository.findByCustomerId(customerId);
        return commandes.stream()
                .map(commandeMapper::toResponse)
                .toList();
    }

   // confirme commande
    @Transactional
    public CommandeResponse confirmerCommande(Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        verifierCommandeModifiable(commande);
        verifierStatutPending(commande);
        verifierCommandeTotalementPayee(commande);

        decrementerStockProduits(commande);
        mettreAJourStatistiquesClient(commande);

        commande.setStatut(CommandeStatut.CONFIRMED);
        commandeRepository.save(commande);

        return commandeMapper.toResponse(commande);
    }

    // aide intern
    private void verifierCommandeModifiable(Commande commande) {
        if (commande.getStatut() == CommandeStatut.CONFIRMED
                || commande.getStatut() == CommandeStatut.CANCELED
                || commande.getStatut() == CommandeStatut.REJECTED) {
            throw new BusinessRuleException("Cette commande est déjà finalisée et ne peut plus être modifiée");
        }
    }

    private void verifierStatutPending(Commande commande) {
        if (commande.getStatut() != CommandeStatut.PENDING) {
            throw new BusinessRuleException("Seules les commandes en statut PENDING peuvent être confirmées");
        }
    }

    private void verifierCommandeTotalementPayee(Commande commande) {
        BigDecimal montantRestant = commande.getMontantRestant();

        if (montantRestant == null) {
            BigDecimal totalTTC = commande.getTotalTTC() != null ? commande.getTotalTTC() : BigDecimal.ZERO;
            montantRestant = totalTTC;
        }

        if (montantRestant.compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessRuleException(
                    "La commande n'est pas totalement payée. Montant restant : " + montantRestant
            );
        }
    }

    private void decrementerStockProduits(Commande commande) {
        for (CommandeLigne ligne : commande.getLignes()) {
            Product produit = ligne.getProduct();
            int stockDisponible = produit.getStockDisponible();
            int quantite = ligne.getQuantite();

            if (stockDisponible < quantite) {
                throw new BusinessRuleException(
                        "Stock insuffisant pour le produit " + produit.getId()
                );
            }

            produit.setStockDisponible(stockDisponible - quantite);
            productRepository.save(produit);
        }
    }

    private void mettreAJourStatistiquesClient(Commande commande) {
        Customer customer = commande.getCustomer();
        if (customer == null) {
            return;
        }

        int totalOrders = customer.getTotalOrders() == null ? 0 : customer.getTotalOrders();
        customer.setTotalOrders(totalOrders + 1);

        BigDecimal totalSpent = customer.getTotalSpent() == null
                ? BigDecimal.ZERO
                : customer.getTotalSpent();

        BigDecimal totalTTCCommande = commande.getTotalTTC() == null
                ? BigDecimal.ZERO
                : commande.getTotalTTC();

        customer.setTotalSpent(totalSpent.add(totalTTCCommande));

        LocalDateTime now = LocalDateTime.now();
        if (customer.getFirstOrderDate() == null) {
            customer.setFirstOrderDate(now);
        }
        customer.setLastOrderDate(now);

        customer.setTier(calculerNouveauTier(customer));
        customerRepository.save(customer);
    }

    // annule commande
    @Transactional
    public CommandeResponse annulerCommande(Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        verifierCommandeModifiable(commande);
        verifierStatutPending(commande);

        commande.setStatut(CommandeStatut.CANCELED);
        commandeRepository.save(commande);

        return commandeMapper.toResponse(commande);
    }

    // calcule niveau de fidélité
    private CustomerTier calculerNouveauTier(Customer customer) {
        int totalOrders = customer.getTotalOrders() == null ? 0 : customer.getTotalOrders();
        BigDecimal totalSpent = customer.getTotalSpent() == null
                ? BigDecimal.ZERO
                : customer.getTotalSpent();

        if (totalOrders >= 20 || totalSpent.compareTo(BigDecimal.valueOf(15000)) >= 0) {
            return CustomerTier.PLATINUM;
        }

        if (totalOrders >= 10 || totalSpent.compareTo(BigDecimal.valueOf(5000)) >= 0) {
            return CustomerTier.GOLD;
        }

        if (totalOrders >= 3 || totalSpent.compareTo(BigDecimal.valueOf(1000)) >= 0) {
            return CustomerTier.SILVER;
        }

        return CustomerTier.BASIC;
    }
}