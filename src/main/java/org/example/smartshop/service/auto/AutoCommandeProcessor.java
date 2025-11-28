package org.example.smartshop.service.auto;

import org.example.smartshop.exception.BusinessRuleException;
import org.example.smartshop.exception.ValidationException;
import org.example.smartshop.model.*;
import org.example.smartshop.model.enums.CommandeStatut;
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

    @Value("${app.tva.taux:20}")
    private BigDecimal tauxTVA;

    @Autowired
    private  PromoCodeRepository promoCodeRepository;

    public boolean verifierStock(List<CommandeLigne> lignes) {

        for (CommandeLigne l : lignes) {
            if (l.getProduct().getStockDisponible() < l.getQuantite()) {
                return false;
            }
        }
        return true;
    }


    public void calculerMontants(Commande commande, Customer customer) {

        BigDecimal sousTotal = BigDecimal.ZERO;

        for (CommandeLigne ligne : commande.getLignes()) {
            ligne.calculerTotal();
            sousTotal = sousTotal.add(ligne.getTotalLigne());
        }

        commande.setSousTotal(sousTotal.setScale(2, RoundingMode.HALF_UP));

        // Remise fidélité
        BigDecimal remiseFidelite = calculerRemiseFidelite(customer.getTier(), sousTotal);
        commande.setRemiseFidelite(remiseFidelite);

        // Code Promo
        BigDecimal remisePromo = calculerRemisePromo(commande.getCodePromo(), sousTotal.subtract(remiseFidelite));
        commande.setRemisePromo(remisePromo);

        // Remise totale
        BigDecimal remiseTotale = remiseFidelite.add(remisePromo);
        commande.setMontantRemiseTotal(remiseTotale);

        // HT après remise
        BigDecimal htApresRemise = sousTotal.subtract(remiseTotale);
        commande.setMontantHTApresRemise(htApresRemise);

        // TVA
        BigDecimal tva = htApresRemise.multiply(tauxTVA.divide(BigDecimal.valueOf(100)));
        commande.setTva(tva.setScale(2, RoundingMode.HALF_UP));

        // Total TTC
        BigDecimal totalTTC = htApresRemise.add(tva);
        commande.setTotalTTC(totalTTC.setScale(2, RoundingMode.HALF_UP));

        commande.setMontantRestant(totalTTC);
    }

    private BigDecimal calculerRemiseFidelite(CustomerTier tier, BigDecimal sousTotal) {
        if (tier == CustomerTier.SILVER && sousTotal.compareTo(BigDecimal.valueOf(500)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.05));
        }
        if (tier == CustomerTier.GOLD && sousTotal.compareTo(BigDecimal.valueOf(800)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.10));
        }
        if (tier == CustomerTier.PLATINUM && sousTotal.compareTo(BigDecimal.valueOf(1200)) >= 0) {
            return sousTotal.multiply(BigDecimal.valueOf(0.15));
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal calculerRemisePromo(String codePromo, BigDecimal montantBase) {

        if (codePromo == null || codePromo.isEmpty())
            return BigDecimal.ZERO;

        PromoCode promo = promoCodeRepository.findByCode(codePromo)
                .orElseThrow(() -> new ValidationException("Code promo invalide : " + codePromo));

        if (!promo.isUtilisable())
            throw new BusinessRuleException("Ce code promo n'est pas valide ou expiré");

        promo.setNombreUtilisations(promo.getNombreUtilisations() + 1);
        promoCodeRepository.save(promo);

        return montantBase.multiply(
                promo.getPourcentageRemise().divide(BigDecimal.valueOf(100))
        );
    }
}
