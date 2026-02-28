package org.example.smartshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "pourcentage_remise", nullable = false, precision = 5, scale = 2)
    private BigDecimal pourcentageRemise;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_expiration", nullable = false)
    private LocalDate dateExpiration;

    @Column(name = "nombre_utilisations_max")
    private Integer nombreUtilisationsMax;

    @Column(name = "nombre_utilisations")
    @Builder.Default
    private Integer nombreUtilisations = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    public boolean isUtilisable() {
        LocalDate today = LocalDate.now();

        if (!actif) return false;

        if (today.isBefore(dateDebut) || today.isAfter(dateExpiration)) {
            return false;
        }

        if (nombreUtilisationsMax != null && nombreUtilisations >= nombreUtilisationsMax) {
            return false;
        }

        return true;
    }
}