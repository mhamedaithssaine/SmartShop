package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "nom",
        "prixUnitaire",
        "stockDisponible",
        "categorie",
        "createdAt",
        "updatedAt"
})
public class ProductResponse {
    private Long id;
    private String nom;
    private BigDecimal prixUnitaire;
    private Integer stockDisponible;
    private String categorie;
    private LocalDateTime createdAt;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocalDateTime updatedAt;
}