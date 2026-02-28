package org.example.smartshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromoCodeRequest {

    @NotBlank(message = "Le code promo est obligatoire")
    @Pattern(regexp = "^PROMO-[A-Z0-9]{4}$", message = "Le code doit être au format PROMO-XXXX (4 caractères alphanumériques)")
    private String code;

    @NotNull(message = "Le pourcentage de remise est obligatoire")
    @DecimalMin(value = "0.01", message = "Le pourcentage doit être supérieur à 0")
    @DecimalMax(value = "100.00", message = "Le pourcentage ne peut pas dépasser 100")
    private BigDecimal pourcentageRemise;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date d'expiration est obligatoire")
    private LocalDate dateExpiration;


    @Min(value = 1, message = "Le nombre d'utilisations max doit être au moins 1")
    private Integer nombreUtilisationsMax;
}