import React from 'react';
import { motion } from 'framer-motion';
import { springBounce } from '../../utils/motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  icon = null,
  type = 'button',
  size = 'md',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-2xl',
    lg: 'px-6 py-3.5 text-base rounded-2xl',
    icon: 'p-2.5 rounded-2xl',
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30',
    secondary:
      'bg-purple-100/80 hover:bg-purple-200/90 text-purple-800 border border-purple-200/50',
    outline:
      'border-2 border-purple-200/80 hover:border-purple-500 hover:bg-purple-50/50 text-slate-700 hover:text-purple-700 bg-white/70 backdrop-blur-sm',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 shadow-sm shadow-rose-200/40',
    ghost: 'hover:bg-purple-50 text-slate-600 hover:text-purple-700',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.95, y: 1 }}
      transition={springBounce}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};
