const PROMO_REGEX = /^PROMO-[A-Z0-9]{4}$/;

/**
 * Valide le format du code promo (PROMO-XXXX).
 * @param {string} code
 * @returns {boolean}
 */
export function isValidPromoFormat(code) {
  if (!code || typeof code !== 'string') return false;
  return PROMO_REGEX.test(code.trim().toUpperCase());
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
