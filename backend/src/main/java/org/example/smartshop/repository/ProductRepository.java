package org.example.smartshop.repository;

import org.example.smartshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsDeletedFalse();

    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Optional<Product> findByIdAndNotDeleted(Long id);

    List<Product> findByIsDeletedFalseAndCategorie(String categorie);

    List<Product> findByIsDeletedFalseAndNomContainingIgnoreCase(String nom);
}