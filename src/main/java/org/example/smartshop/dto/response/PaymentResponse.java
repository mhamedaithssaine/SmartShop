package org.example.smartshop.dto.response;

import lombok.Data;
import org.example.smartshop.model.enums.PaymentMethod;
import org.example.smartshop.model.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long commandeId;

    private String customerName;

    private BigDecimal amount;

    private PaymentMethod method;

    private PaymentStatus status;

    private LocalDateTime createdAt;
}
