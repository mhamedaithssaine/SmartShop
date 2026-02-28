import { motion } from 'framer-motion';

const styleMap = {
  PENDING: 'bg-amber-500/20 text-amber-300',
  CONFIRMED: 'bg-emerald-500/20 text-emerald-300',
  CANCELED: 'bg-red-500/20 text-red-300',
  REJECTED: 'bg-slate-500/20 text-slate-400',
  BASIC: 'bg-slate-500/20 text-slate-400',
  SILVER: 'bg-slate-400/20 text-slate-300',
  GOLD: 'bg-amber-500/20 text-amber-300',
  PLATINUM: 'bg-violet-500/20 text-violet-300',
  EN_ATTENTE: 'bg-amber-500/20 text-amber-300',
  ENCAISSE: 'bg-emerald-500/20 text-emerald-300',
  REJETE: 'bg-red-500/20 text-red-300',
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
  const v = variant || styleMap[value] || 'bg-slate-500/20 text-slate-300';
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
