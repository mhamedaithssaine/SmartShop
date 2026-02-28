import { motion } from 'framer-motion';

export function Card({ children, className = '', animate = true }) {
  const Wrapper = animate ? motion.div : 'div';
  const props = animate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Wrapper className={`card ${className}`} {...props}>
      {children}
    </Wrapper>
  );
}

export function CardHeader({ title, action }) {
  return (
    <div className="card-header flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body p-6 ${className}`}>{children}</div>;
}
