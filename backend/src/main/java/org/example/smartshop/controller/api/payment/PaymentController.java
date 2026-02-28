package org.example.smartshop.controller.api.payment;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.PaymentRequest;
import org.example.smartshop.dto.request.PaymentStatusUpdateRequest;
import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping("/commandes/{commandeId}/paiements")
    public ResponseEntity<ApiRetour<PaymentResponse>> enregistrerPaiement(@PathVariable Long commandeId, @Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.enregistrerPaiement(commandeId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success("Paiement enregistré avec succès", response));
    }


    @GetMapping("/commandes/{commandeId}/paiements")
    public ResponseEntity<ApiRetour<List<PaymentResponse>>> getPaiementsByCommande(@PathVariable Long commandeId) {

        List<PaymentResponse> responses = paymentService.getPaiementsByCommande(commandeId);

        return ResponseEntity.ok(
                ApiRetour.success("Liste des paiements de la commande", responses)
        );
    }


    @PutMapping("/paiements/{paiementId}/statut")
    public ResponseEntity<ApiRetour<PaymentResponse>> changerStatutPaiement(
            @PathVariable Long paiementId,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {

        PaymentResponse response = paymentService.changerStatutPaiement(paiementId, request);

        return ResponseEntity.ok(
                ApiRetour.success("Statut du paiement mis à jour avec succès", response)
        );
    }
}