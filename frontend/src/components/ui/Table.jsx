import { motion } from 'framer-motion';

export function Table({ columns, data, keyExtractor, emptyMessage }) {
  const getKey = keyExtractor || ((row) => row.id);
  const msg = emptyMessage || 'Aucune donnée';

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-600/50 bg-slate-800/50">
      <table className="min-w-full divide-y divide-slate-600/50">
        <thead className="bg-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600/50 bg-slate-800/30">
          {!data?.length ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {msg}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <motion.tr
                key={getKey(row)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-slate-700/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-slate-200">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
