package org.example.smartshop.service;

import org.example.smartshop.dto.request.CommandeRequest;
import org.example.smartshop.dto.response.CommandeResponse;
import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.mapper.CommandeMapper;
import org.example.smartshop.model.*;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.CustomerRepository;
import org.example.smartshop.repository.ProductRepository;
import org.example.smartshop.service.auto.AutoCommandeProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    @Transactional
    public CommandeResponse creerCommande(CommandeRequest request) {

            Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));

        if (request.getCodePromo() != null && !request.getCodePromo().isEmpty()) {
            boolean dejaUtilise = commandeRepository
                    .existsByCustomerIdAndCodePromo(
                            request.getCustomerId(),
                            request.getCodePromo()
                    );

            if (dejaUtilise) {
                throw new BusinessRuleException("Vous avez déjà utilisé ce code promo");
            }
        }

        List<CommandeLigne> lignes = request.getLignes().stream()
                .map(l -> {
                    Product p = productRepository.findByIdAndNotDeleted(l.getProductId())
                            .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé : " + l.getProductId()));

                    return CommandeLigne.builder()
                            .product(p)
                            .quantite(l.getQuantite())
                            .prixUnitaire(p.getPrixUnitaire())
                            .build();
                }).toList();

        boolean stockDisponible = autoCommandeProcessor.verifierStock(lignes);

        Commande commande = Commande.builder()
                .customer(customer)
                .statut(stockDisponible ? CommandeStatut.PENDING : CommandeStatut.REJECTED)
                .codePromo(request.getCodePromo())
                .build();

        lignes.forEach(ligne -> ligne.setCommande(commande));
        commande.getLignes().addAll(lignes);

        lignes.forEach(CommandeLigne::calculerTotal);

        if (stockDisponible) {
            autoCommandeProcessor.calculerMontants(commande, customer);
        } else {
            commande.setSousTotal(BigDecimal.ZERO);
            commande.setRemisePromo(BigDecimal.ZERO);
            commande.setRemiseFidelite(BigDecimal.ZERO);
            commande.setMontantRemiseTotal(BigDecimal.ZERO);
            commande.setMontantHTApresRemise(BigDecimal.ZERO);
            commande.setTva(BigDecimal.ZERO);
            commande.setTotalTTC(BigDecimal.ZERO);
            commande.setMontantRestant(BigDecimal.ZERO);
        }

        commandeRepository.save(commande);

        return commandeMapper.toResponse(commande);
    }

}