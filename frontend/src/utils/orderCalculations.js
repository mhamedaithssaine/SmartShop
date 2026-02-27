import { roundAmount } from './format.js';
import { TVA_RATE } from '../constants/backend.js';

/**
 * Calcule le sous-total HT à partir des lignes.
 * @param {Array<{ quantite: number, prixUnitaire: number }>} lignes
 * @returns {number}
 */
export function calcSousTotalHT(lignes) {
  if (!Array.isArray(lignes) || lignes.length === 0) return 0;
  return lignes.reduce((sum, l) => {
    const q = Number(l.quantite) || 0;
    const p = Number(l.prixUnitaire) || 0;
    return sum + roundAmount(q * p);
  }, 0);
}

/**
 * Calcule la TVA (20%) sur un montant HT.
 * @param {number} ht
 * @returns {number}
 */
export function calcTVA(ht) {
  return roundAmount(ht * TVA_RATE);
}

/**
 * Calcule le TTC à partir de HT et TVA.
 * @param {number} ht
 * @param {number} tva
 * @returns {number}
 */
export function calcTTC(ht, tva) {
  return roundAmount(ht + tva);
}

/**
 * Calcule le montant restant dû (total TTC - somme des paiements encaissés).
 * @param {number} totalTTC
 * @param {Array<{ montant: number, statut: string }>} paiements
 * @returns {number}
 */
export function calcMontantRestant(totalTTC, paiements) {
  const totalTTCNum = roundAmount(totalTTC);
  if (!Array.isArray(paiements)) return totalTTCNum;
  const encaisse = paiements
    .filter((p) => p.statut === 'ENCAISSE')
    .reduce((sum, p) => sum + roundAmount(p.montant || 0), 0);
  return Math.max(0, roundAmount(totalTTCNum - encaisse));
}
