package org.example.smartshop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.smartshop.model.enums.PaymentStatus;

@Data
public class PaymentStatusUpdateRequest {

    @NotNull(message = "Le nouveau statut est obligatoire")
    private PaymentStatus statut;
}