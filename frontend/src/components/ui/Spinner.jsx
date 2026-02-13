import { motion } from 'framer-motion';

export function Spinner({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}
