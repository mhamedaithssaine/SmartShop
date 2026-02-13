import { motion } from 'framer-motion';

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:justify-end items-center gap-4">
        <p className="text-sm text-slate-600">
          Affichage <span className="font-medium">{start}</span> à{' '}
          <span className="font-medium">{end}</span> sur{' '}
          <span className="font-medium">{totalItems}</span>
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Précédent
          </button>
          <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
