import { motion } from 'framer-motion';

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between border-t border-slate-600/50 bg-slate-800/50 px-4 py-3"
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:justify-end items-center gap-4">
        <p className="text-sm text-slate-400">
          Affichage <span className="font-medium text-slate-200">{start}</span> à{' '}
          <span className="font-medium text-slate-200">{end}</span> sur{' '}
          <span className="font-medium text-slate-200">{totalItems}</span>
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Précédent
          </button>
          <span className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
