package org.example.smartshop.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.smartshop.model.enums.PaymentStatus;
import org.example.smartshop.model.enums.PaymentType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @Column(name = "numero_paiement", nullable = false)
    private Integer numeroPaiement;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_paiement", nullable = false, length = 20)
    private PaymentType typePaiement;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private PaymentStatus statut;

    @Column(name = "date_paiement", nullable = false)
    private LocalDate datePaiement;

    @Column(name = "date_encaissement")
    private LocalDateTime dateEncaissement;

    @Column(length = 100)
    private String reference;

    @Column(length = 100)
    private String banque;

    @Column(name = "date_echeance")
    private LocalDate dateEcheance;
}