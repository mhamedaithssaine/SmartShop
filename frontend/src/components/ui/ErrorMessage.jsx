import { motion } from 'framer-motion';

export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-2"
      role="alert"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-red-800 font-medium hover:underline shrink-0"
        >
          Réessayer
        </button>
      )}
    </motion.div>
  );
}
