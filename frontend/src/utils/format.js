/**
 * Arrondit un montant à 2 décimales (pour affichage et calculs).
 * @param {number|string} value
 * @returns {number}
 */
export function roundAmount(value) {
  if (value == null || value === '') return 0;
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100) / 100;
}

/**
 * Formate un montant pour affichage (2 décimales, séparateur décimal).
 * @param {number|string} value
 * @param {string} suffix
 * @returns {string}
 */
export function formatAmount(value, suffix = ' DH') {
  const n = roundAmount(value);
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
}

/**
 * Formate une date ISO pour affichage.
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Formate date + heure.
 * @param {string} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
  if (!iso) return '–';
  const d = new Date(iso);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
