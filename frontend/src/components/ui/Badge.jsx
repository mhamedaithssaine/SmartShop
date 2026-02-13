import { motion } from 'framer-motion';

const styleMap = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  CANCELED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-slate-200 text-slate-700',
  BASIC: 'bg-slate-100 text-slate-600',
  SILVER: 'bg-slate-200 text-slate-700',
  GOLD: 'bg-amber-100 text-amber-800',
  PLATINUM: 'bg-indigo-100 text-indigo-800',
  EN_ATTENTE: 'bg-amber-100 text-amber-800',
  ENCAISSE: 'bg-emerald-100 text-emerald-800',
  REJETE: 'bg-red-100 text-red-800',
};

const labelMap = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELED: 'Annulée',
  REJECTED: 'Rejetée',
  BASIC: 'Basic',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  EN_ATTENTE: 'En attente',
  ENCAISSE: 'Encaissé',
  REJETE: 'Rejeté',
  ESPECES: 'Espèces',
  CHEQUE: 'Chèque',
  VIREMENT: 'Virement',
};

export function Badge({ value, variant, label }) {
  const v = variant || styleMap[value] || 'bg-slate-100 text-slate-700';
  const text = label != null ? label : (labelMap[value] ?? value);

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${v}`}
    >
      {text}
    </motion.span>
  );
}
