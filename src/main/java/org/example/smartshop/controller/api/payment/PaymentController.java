package org.example.smartshop.controller.api.payment;

import jakarta.validation.Valid;
import org.example.smartshop.dto.api.reponse.ApiRetour;
import org.example.smartshop.dto.request.PaymentRequest;
import org.example.smartshop.dto.response.PaymentResponse;
import org.example.smartshop.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping
    public ResponseEntity<ApiRetour<PaymentResponse>> payer(@Valid @RequestBody PaymentRequest request) {

        PaymentResponse response = paymentService.effectuerPaiement(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiRetour.success("Paiement effectué avec succès", response));
    }
}
