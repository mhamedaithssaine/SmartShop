import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/products', label: 'Produits', icon: '📦' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/orders', label: 'Commandes', icon: '📋' },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white shadow-sm lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <span className="text-xl font-bold text-primary-600">SmartShop</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
