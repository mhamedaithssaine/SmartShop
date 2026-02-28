package org.example.smartshop.service;

import org.example.smartshop.dto.request.PaymentRequest;
import org.example.smartshop.dto.request.PaymentStatusUpdateRequest;
import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.mapper.PaymentMapper;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.Payment;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.model.enums.PaymentStatus;
import org.example.smartshop.model.enums.PaymentType;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private PaymentMapper paymentMapper;


    // créer paiement
    @Transactional
    public PaymentResponse enregistrerPaiement(Long commandeId, PaymentRequest request) {

        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        if (commande.getStatut() != CommandeStatut.PENDING) {
            throw new BusinessRuleException("Les paiements ne peuvent être enregistrés que pour les commandes en statut PENDING");
        }

        if (commande.getTotalTTC() == null) {
            throw new BusinessRuleException("Le total TTC de la commande n'est pas défini");
        }

        BigDecimal montantRestant = commande.getMontantRestant() != null
                ? commande.getMontantRestant()
                : commande.getTotalTTC();

        if (request.getMontant() == null || request.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Le montant du paiement doit être strictement positif");
        }

        if (request.getMontant().compareTo(montantRestant) > 0) {
            throw new BusinessRuleException("Le montant du paiement dépasse le montant restant à payer");
        }

        if (request.getTypePaiement() == PaymentType.ESPECES
                && request.getMontant().compareTo(BigDecimal.valueOf(20000)) > 0) {
            throw new BusinessRuleException("Le paiement en espèces ne peut pas dépasser 20 000 DH");
        }

        validateFieldsByType(request);

        long count = paymentRepository.countByCommandeId(commandeId);
        int numeroPaiement = (int) count + 1;

        PaymentStatus statutInitial;
        LocalDateTime dateEncaissement = null;

        if (request.getTypePaiement() == PaymentType.ESPECES || request.getTypePaiement() == PaymentType.VIREMENT) {
            statutInitial = PaymentStatus.ENCAISSE;
            dateEncaissement = LocalDateTime.now();
        } else {
            statutInitial = PaymentStatus.EN_ATTENTE;
        }

        Payment payment = Payment.builder()
                .commande(commande)
                .numeroPaiement(numeroPaiement)
                .montant(request.getMontant())
                .typePaiement(request.getTypePaiement())
                .statut(statutInitial)
                .datePaiement(request.getDatePaiement())
                .dateEncaissement(dateEncaissement)
                .reference(request.getReference())
                .banque(request.getBanque())
                .dateEcheance(request.getDateEcheance())
                .build();

        paymentRepository.save(payment);

        recalculerMontantRestant(commande);

        PaymentResponse dto = paymentMapper.toResponse(payment);
        dto.setMontantRestantCommande(commande.getMontantRestant());
        return dto;
    }

    private void validateFieldsByType(PaymentRequest request) {
        PaymentType type = request.getTypePaiement();

        if (type == PaymentType.CHEQUE) {
            if (request.getReference() == null || request.getReference().isBlank()) {
                throw new BusinessRuleException("Le numéro de chèque (référence) est obligatoire pour un paiement par chèque");
            }
            if (request.getBanque() == null || request.getBanque().isBlank()) {
                throw new BusinessRuleException("La banque est obligatoire pour un paiement par chèque");
            }
            if (request.getDateEcheance() == null) {
                throw new BusinessRuleException("La date d'échéance est obligatoire pour un paiement par chèque");
            }
        }

        if (type == PaymentType.VIREMENT) {
            if (request.getReference() == null || request.getReference().isBlank()) {
                throw new BusinessRuleException("La référence du virement est obligatoire");
            }
            if (request.getBanque() == null || request.getBanque().isBlank()) {
                throw new BusinessRuleException("La banque est obligatoire pour un virement");
            }
        }

        if (type == PaymentType.ESPECES) {
            if (request.getReference() == null || request.getReference().isBlank()) {
                throw new BusinessRuleException("Le numéro de reçu est obligatoire pour un paiement en espèces");
            }
        }
    }


     // change status
    @Transactional
    public PaymentResponse changerStatutPaiement(Long paiementId, PaymentStatusUpdateRequest request) {

        Payment payment = paymentRepository.findById(paiementId)
                .orElseThrow(() -> new ResourceNotFoundException("Paiement non trouvé"));

        Commande commande = payment.getCommande();
        if (commande == null) {
            throw new BusinessRuleException("Le paiement n'est lié à aucune commande");
        }

        PaymentStatus nouveauStatut = request.getStatut();
        payment.setStatut(nouveauStatut);

        if (nouveauStatut == PaymentStatus.ENCAISSE) {
            if (payment.getDateEncaissement() == null) {
                payment.setDateEncaissement(LocalDateTime.now());
            }
        } else {
            payment.setDateEncaissement(null);
        }

        paymentRepository.save(payment);

        recalculerMontantRestant(commande);

        PaymentResponse dto = paymentMapper.toResponse(payment);
        dto.setMontantRestantCommande(commande.getMontantRestant());
        return dto;
    }


    // liste paiements
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaiementsByCommande(Long commandeId) {

        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        List<Payment> payments = paymentRepository.findByCommandeId(commandeId);

        BigDecimal montantRestant = commande.getMontantRestant() != null
                ? commande.getMontantRestant()
                : commande.getTotalTTC();

        List<PaymentResponse> dtos = paymentMapper.toResponses(payments);
        dtos.forEach(dto -> dto.setMontantRestantCommande(montantRestant));

        return dtos;
    }


    //aide interne
    private void recalculerMontantRestant(Commande commande) {
        List<Payment> payments = paymentRepository.findByCommandeId(commande.getId());

        BigDecimal totalTTC = commande.getTotalTTC() != null
                ? commande.getTotalTTC()
                : BigDecimal.ZERO;

        BigDecimal totalPaye = payments.stream()
                .filter(p -> p.getStatut() != PaymentStatus.REJETE)
                .map(Payment::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal montantRestant = totalTTC.subtract(totalPaye);
        if (montantRestant.compareTo(BigDecimal.ZERO) < 0) {
            montantRestant = BigDecimal.ZERO;
        }

        commande.setMontantRestant(montantRestant);
        commandeRepository.save(commande);
    }
}