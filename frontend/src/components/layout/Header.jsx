import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';
import { USER_ROLE } from '../../constants/backend.js';
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-800 lg:text-xl">Tableau de bord</h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-slate-600">
          {user?.role === USER_ROLE.ADMIN ? 'Admin' : 'Client'}
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Déconnexion
        </Button>
      </motion.div>
    </header>
  );
}
