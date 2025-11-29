package org.example.smartshop.service;

import org.example.smartshop.dto.request.PaymentRequest;
import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ResourceNotFoundException;
import org.example.smartshop.mapper.PaymentMapper;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.Payment;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.model.enums.PaymentMethod;
import org.example.smartshop.model.enums.PaymentStatus;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private PaymentMapper paymentMapper;

    @Transactional
    public PaymentResponse effectuerPaiement(PaymentRequest request) {

        // 1) الحصول على commande
        Commande commande = commandeRepository.findById(request.getCommandeId())
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        // 2) واش مزال خاصو يخلص ؟
        if (commande.getMontantRestant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Cette commande est déjà totalement payée.");
        }

        // 3) التأكد من المبلغ
        if (request.getAmount().compareTo(commande.getMontantRestant()) > 0) {
            throw new BusinessRuleException("Le montant dépasse le montant restant.");
        }

        // 4) espèces 20.000 dh max
        if (request.getMethod() == PaymentMethod.ESPECES &&
                request.getAmount().compareTo(BigDecimal.valueOf(20000)) > 0) {

            throw new BusinessRuleException("Paiement en espèces > 20.000 MAD interdit.");
        }

        // 5) إنشاء payment
        Payment payment = Payment.builder()
                .commande(commande)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.ENCAISSE)
                .build();

        paymentRepository.save(payment);

        // 6) تحديث montant restant
        BigDecimal nouveauRestant =
                commande.getMontantRestant().subtract(request.getAmount());

        commande.setMontantRestant(nouveauRestant);

        // 7) إذا خلّص كلشي → تصبح PAID
        if (nouveauRestant.compareTo(BigDecimal.ZERO) == 0) {
            commande.setStatut(CommandeStatut.CONFIRMED);
        }

        commandeRepository.save(commande);

        return paymentMapper.toResponse(payment);
    }

}
