package org.example.smartshop.repository;

import org.example.smartshop.model.PromoCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {

    Optional<PromoCode> findByCode(String code);

    boolean existsByCode(String code);

    List<PromoCode> findByActifTrue();

    @Query("SELECT p FROM PromoCode p WHERE p.actif = true AND p.dateDebut <= :today AND p.dateExpiration >= :today")
    List<PromoCode> findValidPromoCodesByDate(LocalDate today);
}