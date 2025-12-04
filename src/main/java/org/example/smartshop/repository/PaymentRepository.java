package org.example.smartshop.repository;

import org.example.smartshop.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findByCommandeId(Long commandeId);

    long countByCommandeId(Long commandeId);
}
