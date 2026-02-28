import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

export function Layout() {
  return (
    <div className="app-shell flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
