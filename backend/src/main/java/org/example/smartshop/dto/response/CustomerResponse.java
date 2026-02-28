package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.example.smartshop.model.enums.CustomerTier;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "nom",
        "email",
        "telephone",
        "tier",
        "totalOrders",
        "totalSpent",
        "firstOrderDate",
        "lastOrderDate",
        "createdAt",
        "updatedAt"
})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerResponse {
    private Long id;

    private String nom;

    private String email;

    private String telephone;

    private CustomerTier tier;

    private Integer totalOrders;

    private BigDecimal totalSpent;

    private LocalDateTime firstOrderDate;

    private LocalDateTime lastOrderDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
