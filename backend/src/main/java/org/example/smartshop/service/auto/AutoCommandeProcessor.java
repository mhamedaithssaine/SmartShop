package org.example.smartshop.service.auto;

import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.model.Commande;
import org.example.smartshop.model.CommandeLigne;
import org.example.smartshop.model.Customer;
import org.example.smartshop.model.PromoCode;
import org.example.smartshop.model.enums.CustomerTier;
import org.example.smartshop.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class AutoCommandeProcessor {

    private static final int SCALE = 2;
    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;

    @Value("${app.tva.taux:20}")
    private BigDecimal tauxTVA;

    @Autowired
    private PromoCodeRepository promoCodeRepository;


    // verifier stock
    public boolean verifierStock(List<CommandeLigne> lignes) {
        for (CommandeLigne ligne : lignes) {
            if (ligne.getProduct().getStockDisponible() < ligne.getQuantite()) {
                return false;
            }
        }
        return true;
    }


    // calcule Montants
    public void calculerMontants(Commande commande, Customer customer) {
        BigDecimal sousTotal = calculerSousTotal(commande);

        commande.setSousTotal(sousTotal.setScale(SCALE, ROUNDING_MODE));

        BigDecimal remiseFidelite = calculerRemiseFidelite(customer.getTier(), sousTotal);
        commande.setRemiseFidelite(remiseFidelite);

        BigDecimal baseApresFidelite = sousTotal.subtract(remiseFidelite);

        BigDecimal remisePromo = calculerRemisePromo(commande.getCodePromo(), baseApresFidelite);
        commande.setRemisePromo(remisePromo);

        BigDecimal remiseTotale = remiseFidelite.add(remisePromo);
        commande.setMontantRemiseTotal(remiseTotale);

        BigDecimal htApresRemise = sousTotal.subtract(remiseTotale)
                .setScale(SCALE, ROUNDING_MODE);
        commande.setMontantHTApresRemise(htApresRemise);

        BigDecimal tva = htApresRemise
                .multiply(tauxTVA)
                .divide(BigDecimal.valueOf(100), SCALE, ROUNDING_MODE);
        commande.setTva(tva);

        BigDecimal totalTTC = htApresRemise.add(tva)
                .setScale(SCALE, ROUNDING_MODE);
        commande.setTotalTTC(totalTTC);

        commande.setMontantRestant(totalTTC);
    }

    private BigDecimal calculerSousTotal(Commande commande) {
        BigDecimal sousTotal = BigDecimal.ZERO;

        for (CommandeLigne ligne : commande.getLignes()) {
            ligne.calculerTotal();
            sousTotal = sousTotal.add(ligne.getTotalLigne());
        }

        return sousTotal;
    }

    // calcule remise
    private BigDecimal calculerRemiseFidelite(CustomerTier tier, BigDecimal sousTotal) {
        if (tier == null) {
            return BigDecimal.ZERO;
        }

        if (tier == CustomerTier.SILVER && sousTotal.compareTo(BigDecimal.valueOf(500)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.05))
                    .setScale(SCALE, ROUNDING_MODE);
        }

        if (tier == CustomerTier.GOLD && sousTotal.compareTo(BigDecimal.valueOf(800)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.10))
                    .setScale(SCALE, ROUNDING_MODE);
        }

        if (tier == CustomerTier.PLATINUM && sousTotal.compareTo(BigDecimal.valueOf(1200)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.15))
                    .setScale(SCALE, ROUNDING_MODE);
        }

        return BigDecimal.ZERO;
    }

    // calcule remise promo
    private BigDecimal calculerRemisePromo(String codePromo, BigDecimal montantBase) {
        if (codePromo == null || codePromo.isBlank()) {
            return BigDecimal.ZERO;
        }

        PromoCode promo = promoCodeRepository.findByCode(codePromo)
                .orElseThrow(() -> new ValidationException("Code promo invalide : " + codePromo));

        if (!promo.isUtilisable()) {
            throw new BusinessRuleException("Ce code promo n'est pas valide ou expiré");
        }

        promo.setNombreUtilisations(promo.getNombreUtilisations() + 1);
        promoCodeRepository.save(promo);

        BigDecimal pourcentage = promo.getPourcentageRemise()
                .divide(BigDecimal.valueOf(100), SCALE + 2, ROUNDING_MODE);

        return montantBase.multiply(pourcentage)
                .setScale(SCALE, ROUNDING_MODE);
    }
}