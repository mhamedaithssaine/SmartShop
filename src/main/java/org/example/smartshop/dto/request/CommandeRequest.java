package org.example.smartshop.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class CommandeRequest {

    @NotNull(message = "L'ID du client est obligatoire")
    private Long customerId;

    @Pattern(regexp = "^PROMO-[A-Z0-9]{4}$", message = "Le code promo doit être au format PROMO-XXXX")
    private String codePromo;

    @NotEmpty(message = "La commande doit contenir au moins un produit")
    @Valid
    private List<CommandeLigneRequest> lignes;
}