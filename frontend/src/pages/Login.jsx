import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../state/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

const formStagger = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

const errorShake = {
  x: [-8, 8, -8, 8, 0],
  transition: { duration: 0.4 },
};

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (isAuthenticated) return <Navigate to="/products" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/products', { replace: true });
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg relative flex min-h-screen flex-col lg:flex-row">
      {/* Animated glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-violet-500/25 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/15 blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/3 top-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-[90px]"
          animate={{
            x: [0, 20, 0],
            y: [0, 25, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div className="login-page-grid pointer-events-none fixed inset-0 opacity-[0.04]" />

      {/* Left panel — Welcome (desktop) */}
      <div className="relative hidden min-h-screen flex-col justify-center px-12 lg:flex lg:w-[55%] xl:px-20">
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white xl:text-5xl">
            Welcome Back .!
          </h1>
          <div className="mt-6 inline-block rounded-lg border border-white/30 px-4 py-2.5 backdrop-blur-sm">
            <span className="text-sm font-medium text-white/90">Skip the lag ?</span>
          </div>
        </motion.div>
        <motion.div
          className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]"
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Right panel — login form */}
      <div className="relative z-10 flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-10 lg:w-[45%]">
        <motion.div
          className="login-dark w-full max-w-md rounded-2xl border border-slate-600/40 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <motion.h2 variants={formStagger} custom={0} className="text-2xl font-bold text-white md:text-3xl">
            Connexion
          </motion.h2>
          <motion.p variants={formStagger} custom={1} className="mt-1 text-sm font-medium text-slate-400">
            Content de vous revoir !
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <motion.div variants={formStagger} custom={2}>
              <Input
                label="Email / Identifiant"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="username"
              />
            </motion.div>
            <motion.div variants={formStagger} custom={3}>
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  autoComplete="current-password"
                />
                <span className="absolute right-3 top-9 text-slate-400" aria-hidden>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </motion.div>

            <motion.div variants={formStagger} custom={4} className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember" className="text-sm text-slate-300">
                Se souvenir de moi
              </label>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ ...errorShake, opacity: 1 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <motion.div variants={formStagger} custom={5}>
              <Button
                type="submit"
                variant="primary"
                className="w-full min-h-[48px] bg-gradient-to-r from-blue-500 to-violet-500 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-violet-500/30 focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                loading={loading}
                disabled={loading}
              >
                Connexion
              </Button>
            </motion.div>
          </form>

          <motion.div variants={formStagger} custom={6} className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
            >
              Mot de passe oublié ?
            </a>
          </motion.div>

          <motion.div variants={formStagger} custom={7} className="mt-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-600" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Ou</span>
            <span className="h-px flex-1 bg-slate-600" />
          </motion.div>

          <motion.div variants={formStagger} custom={8} className="mt-6 flex justify-center gap-4">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 text-slate-400 transition hover:border-slate-500 hover:text-white"
              aria-label="Connexion Google"
            >
              <span className="text-sm font-bold">G</span>
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 text-slate-400 transition hover:border-slate-500 hover:text-white"
              aria-label="Connexion Facebook"
            >
              <span className="text-sm font-bold">f</span>
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 text-slate-400 transition hover:border-slate-500 hover:text-white"
              aria-label="Connexion GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>

          <motion.p variants={formStagger} custom={9} className="mt-6 text-center text-sm text-slate-400">
            Pas de compte ?{' '}
            <a href="#" className="font-medium text-white/90 hover:text-white">
              Inscription
            </a>
          </motion.p>

          <motion.div variants={formStagger} custom={10} className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-1 border-t border-slate-700/50 pt-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-400">CGV</a>
            <a href="#" className="hover:text-slate-400">Support</a>
            <a href="#" className="hover:text-slate-400">Service client</a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
