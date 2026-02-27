import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300',
};

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  loading,
  className = '',
  size = 'md',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        transition-colors
        ${variants[variant] || variants.primary}
        ${sizeClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  );
}
