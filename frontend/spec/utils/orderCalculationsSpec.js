import {
  calcSousTotalHT,
  calcTVA,
  calcTTC,
  calcMontantRestant,
} from '../../src/utils/orderCalculations.js';

describe('orderCalculations', () => {
  describe('calcSousTotalHT', () => {
    it('calcule le sous-total à partir des lignes', () => {
      const lignes = [
        { quantite: 2, prixUnitaire: 100 },
        { quantite: 1, prixUnitaire: 50 },
      ];
      expect(calcSousTotalHT(lignes)).toBe(250);
    });
    it('retourne 0 pour tableau vide', () => {
      expect(calcSousTotalHT([])).toBe(0);
    });
  });

  describe('calcTVA', () => {
    it('calcule 20% de TVA', () => {
      expect(calcTVA(100)).toBe(20);
    });
  });

  describe('calcTTC', () => {
    it('calcule HT + TVA', () => {
      expect(calcTTC(100, 20)).toBe(120);
    });
  });

  describe('calcMontantRestant', () => {
    it('soustrait les paiements encaissés du total TTC', () => {
      const paiements = [
        { montant: 50, statut: 'ENCAISSE' },
        { montant: 30, statut: 'EN_ATTENTE' },
      ];
      expect(calcMontantRestant(100, paiements)).toBe(50);
    });
    it('retourne totalTTC si aucun paiement', () => {
      expect(calcMontantRestant(100, [])).toBe(100);
    });
  });
});
