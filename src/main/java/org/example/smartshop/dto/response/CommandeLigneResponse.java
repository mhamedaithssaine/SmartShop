package org.example.smartshop.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CommandeLigneResponse {
    private Long id;
    private Long productId;
    private String productNom;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal totalLigne;
}