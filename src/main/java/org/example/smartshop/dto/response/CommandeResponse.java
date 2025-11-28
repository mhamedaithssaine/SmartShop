package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.example.smartshop.model.enums.CommandeStatut;
import org.example.smartshop.model.enums.CustomerTier;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonPropertyOrder({
        "id",
        "customerId",
        "customerNom",
        "customerTier",
        "statut",
        "lignes",
        "sousTotal",
        "remiseFidelite",
        "remisePromo",
        "montantRemiseTotal",
        "montantHTApresRemise",
        "tva",
        "totalTTC",
        "montantRestant",
        "codePromo",
        "createdAt",
        "updatedAt"
})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommandeResponse {
    private Long id;
    private Long customerId;
    private String customerNom;
    private CustomerTier customerTier;
    private CommandeStatut statut;
    private List<CommandeLigneResponse> lignes;

    // Montants
    private BigDecimal sousTotal;
    private BigDecimal remiseFidelite;
    private BigDecimal remisePromo;
    private BigDecimal montantRemiseTotal;
    private BigDecimal montantHTApresRemise;
    private BigDecimal tva;
    private BigDecimal totalTTC;
    private BigDecimal montantRestant;

    private String codePromo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}