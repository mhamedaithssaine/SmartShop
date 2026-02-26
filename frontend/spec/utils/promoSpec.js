import { isValidPromoFormat, normalizePromoCode } from '../../src/utils/promo.js';

describe('promo utils', () => {
  describe('isValidPromoFormat', () => {
    it('valide le format PROMO-XXXX', () => {
      expect(isValidPromoFormat('PROMO-ABCD')).toBe(true);
      expect(isValidPromoFormat('PROMO-1234')).toBe(true);
    });
    it('rejette les formats invalides', () => {
      expect(isValidPromoFormat('PROMO-ABC')).toBe(false);
      expect(isValidPromoFormat('promo-ABCD')).toBe(true);
    });
    it('retourne false pour vide ou non-string', () => {
      expect(isValidPromoFormat('')).toBe(false);
      expect(isValidPromoFormat(null)).toBe(false);
    });
  });

  describe('normalizePromoCode', () => {
    it('met en majuscules', () => {
      expect(normalizePromoCode('promo-abcd')).toBe('PROMO-ABCD');
    });
  });
});
