import { roundAmount, formatAmount } from '../../src/utils/format.js';

describe('format utils', () => {
  describe('roundAmount', () => {
    it('arrondit à 2 décimales', () => {
      expect(roundAmount(10.126)).toBe(10.13);
      expect(roundAmount(10.124)).toBe(10.12);
    });
    it('retourne 0 pour null ou vide', () => {
      expect(roundAmount(null)).toBe(0);
      expect(roundAmount('')).toBe(0);
    });
    it('accepte une chaîne numérique', () => {
      expect(roundAmount('5.556')).toBe(5.56);
    });
  });

  describe('formatAmount', () => {
    it('affiche avec 2 décimales et suffixe DH', () => {
      expect(formatAmount(100)).toContain('100,00');
      expect(formatAmount(100)).toContain(' DH');
    });
  });
});
