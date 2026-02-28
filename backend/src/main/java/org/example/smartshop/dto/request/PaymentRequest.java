package org.example.smartshop.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.smartshop.model.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentRequest {

    @NotNull(message = "Le montant du paiement est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être strictement positif")
    private BigDecimal montant;

    @NotNull(message = "Le type de paiement est obligatoire")
    private PaymentType typePaiement;

    @NotNull(message = "La date de paiement est obligatoire")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate datePaiement;
    private String reference;

    private String banque;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEcheance;
}