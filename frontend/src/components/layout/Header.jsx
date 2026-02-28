import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';
import { USER_ROLE } from '../../constants/backend.js';
import { LogOut } from 'lucide-react';
import { Button } from '../ui/Button.jsx';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white lg:text-xl">Tableau de bord</h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-slate-400">
          {user?.role === USER_ROLE.ADMIN ? 'Admin' : 'Client'}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:bg-slate-800 hover:text-white">
          <LogOut className="h-4 w-4 shrink-0" /> Déconnexion
        </Button>
      </motion.div>
    </header>
  );
}
