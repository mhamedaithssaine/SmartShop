import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Users, ClipboardList, Tag } from 'lucide-react';
import { useAuth } from '../../state/AuthContext.jsx';

const links = [
  { to: '/products', label: 'Produits', Icon: Package, adminOnly: false },
  { to: '/clients', label: 'Clients', Icon: Users, adminOnly: true },
  { to: '/orders', label: 'Commandes', Icon: ClipboardList, adminOnly: false },
  { to: '/promo-codes', label: 'Codes promo', Icon: Tag, adminOnly: true },
];

export function Sidebar() {
  const { isAdmin } = useAuth();
  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-700/50 bg-slate-900/90 shadow-xl backdrop-blur-sm lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-700/50 px-6">
        <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">SmartShop</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {visibleLinks.map((link, index) => (
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
                    ? 'bg-violet-500/20 text-violet-200'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <link.Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
              {link.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
