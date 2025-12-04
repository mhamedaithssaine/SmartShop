package org.example.smartshop.repository;

import org.example.smartshop.model.Commande;
import org.example.smartshop.model.enums.CommandeStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    boolean existsByCustomerIdAndCodePromo(Long customerId, String codePromo);
    List<Commande> findByCustomerId(Long customerId);

}