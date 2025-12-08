package org.example.smartshop.service;

import org.example.smartshop.dto.request.PaymentRequest;
import org.example.smartshop.dto.request.PaymentStatusUpdateRequest;
import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.mapper.PaymentMapper;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.Payment;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.model.enums.PaymentStatus;
import org.example.smartshop.model.enums.PaymentType;
import org.example.smartshop.repository.CommandeRepository;
import org.example.smartshop.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CommandeRepository commandeRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private PaymentService paymentService;


    @Test
    void enregistrerPaiement_especes_valide_metAJourMontantRestant() {
        Long commandeId = 1L;

        Commande commande = Commande.builder()
                .id(commandeId)
                .statut(CommandeStatut.PENDING)
                .totalTTC(BigDecimal.valueOf(1000))
                .montantRestant(BigDecimal.valueOf(1000))
                .build();

        when(commandeRepository.findById(commandeId))
                .thenReturn(Optional.of(commande));

        when(paymentRepository.countByCommandeId(commandeId)).thenReturn(0L);

        Payment paiementExistant = Payment.builder()
                .montant(BigDecimal.valueOf(400))
                .statut(PaymentStatus.ENCAISSE)
                .build();

        when(paymentRepository.findByCommandeId(commandeId))
                .thenReturn(List.of(paiementExistant));

        when(paymentMapper.toResponse(any(Payment.class)))
                .thenAnswer(invocation -> {
                    Payment p = invocation.getArgument(0);
                    PaymentResponse dto = new PaymentResponse();
                    dto.setId(10L);
                    dto.setCommandeId(commandeId);
                    dto.setMontant(p.getMontant());
                    dto.setTypePaiement(p.getTypePaiement());
                    dto.setStatut(p.getStatut());
                    dto.setDatePaiement(p.getDatePaiement());
                    return dto;
                });

        PaymentRequest request = new PaymentRequest();
        request.setMontant(BigDecimal.valueOf(400));
        request.setTypePaiement(PaymentType.ESPECES);
        request.setDatePaiement(LocalDate.now());
        request.setReference("RECU-001");

        PaymentResponse response = paymentService.enregistrerPaiement(commandeId, request);

        assertThat(response.getStatut()).isEqualTo(PaymentStatus.ENCAISSE);
        assertThat(response.getTypePaiement()).isEqualTo(PaymentType.ESPECES);
        assertThat(response.getMontant()).isEqualByComparingTo(BigDecimal.valueOf(400));

        assertThat(response.getMontantRestantCommande())
                .isEqualByComparingTo(BigDecimal.valueOf(600));

        verify(commandeRepository, atLeastOnce()).save(argThat(cmd ->
                cmd.getId().equals(commandeId)
                        && cmd.getMontantRestant().compareTo(BigDecimal.valueOf(600)) == 0
        ));

        verify(paymentRepository, times(1)).save(any(Payment.class));
    }


    @Test
    void enregistrerPaiement_montantDepasseRestant_declencheBusinessRuleException() {
        Long commandeId = 2L;

        Commande commande = Commande.builder()
                .id(commandeId)
                .statut(CommandeStatut.PENDING)
                .totalTTC(BigDecimal.valueOf(1000))
                .montantRestant(BigDecimal.valueOf(300))
                .build();

        when(commandeRepository.findById(commandeId))
                .thenReturn(Optional.of(commande));

        PaymentRequest request = new PaymentRequest();
        request.setMontant(BigDecimal.valueOf(400));
        request.setTypePaiement(PaymentType.ESPECES);
        request.setDatePaiement(LocalDate.now());
        request.setReference("RECU-002");

        assertThrows(BusinessRuleException.class, () ->
                paymentService.enregistrerPaiement(commandeId, request)
        );

        verify(paymentRepository, never()).save(any());
        verify(commandeRepository, never()).save(any());
    }
}