package org.example.smartshop.model.enums;

public enum CommandeStatut {
    PENDING,      // En attente de validation
    CONFIRMED,    // Validée par ADMIN (après paiement complet)
    CANCELED,     // Annulée manuellement par ADMIN
    REJECTED      // Refusée (stock insuffisant)
}