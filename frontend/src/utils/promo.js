import { PROMO_CODE_PATTERN } from '../constants/backend.js';

/**
 * Valide le format du code promo (PROMO-XXXX) – aligné backend CommandeRequest.
 * @param {string} code
 * @returns {boolean}
 */
export function isValidPromoFormat(code) {
  if (!code || typeof code !== 'string') return false;
  return PROMO_CODE_PATTERN.test(code.trim().toUpperCase());
}

/**
 * Normalise le code pour comparaison (majuscules).
 * @param {string} code
 * @returns {string}
 */
export function normalizePromoCode(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase();
}
