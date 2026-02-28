package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "code",
        "pourcentageRemise",
        "actif",
        "utilisable",
        "dateDebut",
        "dateExpiration",
        "nombreUtilisationsMax",
        "nombreUtilisations",
        "createdAt",
        "updatedAt"
})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PromoCodeResponse {
    private Long id;
    private String code;
    private BigDecimal pourcentageRemise;
    private Boolean actif;
    private Boolean utilisable;
    private LocalDate dateDebut;
    private LocalDate dateExpiration;
    private Integer nombreUtilisationsMax;
    private Integer nombreUtilisations;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}