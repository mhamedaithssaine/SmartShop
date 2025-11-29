package org.example.smartshop.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.smartshop.model.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PaymentRequest {

    @NotNull(message = "L'ID de la commande est obligatoire")
    private Long commandeId;

    @NotNull(message = "Le montant du paiement est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal amount;


    // par défaut espèces
    private PaymentMethod method = PaymentMethod.ESPECES;
}
