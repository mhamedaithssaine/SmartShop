package org.example.smartshop.model;

import jakarta.persistence.*;
import lombok.*;
import org.example.smartshop.model.enums.CommandeStatut;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commandes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CommandeLigne> lignes = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CommandeStatut statut = CommandeStatut.PENDING;

    @Column(name = "sous_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal sousTotal;

    @Column(name = "remise_fidelite", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal remiseFidelite = BigDecimal.ZERO;

    @Column(name = "remise_promo", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal remisePromo = BigDecimal.ZERO;

    @Column(name = "montant_remise_total", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montantRemiseTotal = BigDecimal.ZERO;

    @Column(name = "montant_ht_apres_remise", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantHTApresRemise;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal tva;

    @Column(name = "total_ttc", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalTTC;

    @Column(name = "montant_restant", nullable = false, precision = 10, scale = 2)
    private BigDecimal montantRestant;

    @Column(name = "code_promo", length = 20)
    private String codePromo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Payment> payments = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void ajouterLigne(CommandeLigne ligne) {
        lignes.add(ligne);
        ligne.setCommande(this);
    }
}