package org.example.smartshop.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.example.smartshop.model.enums.PaymentStatus;
import org.example.smartshop.model.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({
        "id",
        "commandeId",
        "numeroPaiement",
        "montant",
        "typePaiement",
        "statut",
        "datePaiement",
        "dateEncaissement",
        "reference",
        "banque",
        "dateEcheance",
        "montantRestantCommande"
})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {

    private Long id;
    private Long commandeId;
    private Integer numeroPaiement;
    private BigDecimal montant;
    private PaymentType typePaiement;
    private PaymentStatus statut;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate datePaiement;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateEncaissement;

    private String reference;
    private String banque;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEcheance;

    private BigDecimal montantRestantCommande;
}