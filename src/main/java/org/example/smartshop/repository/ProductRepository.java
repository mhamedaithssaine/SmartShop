package org.example.smartshop.repository;

import org.example.smartshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Trouver tous les produits non supprimés
    List<Product> findByIsDeletedFalse();

    // Trouver par ID (non supprimé)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Optional<Product> findByIdAndNotDeleted(Long id);

    // Trouver par catégorie (non supprimés)
    List<Product> findByIsDeletedFalseAndCategorie(String categorie);

    // Recherche par nom (non supprimés)
    List<Product> findByIsDeletedFalseAndNomContainingIgnoreCase(String nom);
}