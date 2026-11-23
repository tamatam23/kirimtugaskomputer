import React from 'react';
import { motion } from 'framer-motion';
import { springBounce, popCard } from '../../utils/motion';
import { KineticLine, KineticNumber } from './MotionTypography';

export const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  gradient = 'from-purple-500 to-indigo-500',
  iconBg = 'bg-purple-100 text-purple-600',
  suffix = '',
  onClick,
  variants = popCard,
}) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={springBounce}
      onClick={onClick}
      className={`glass-card p-6 rounded-3xl relative overflow-hidden transition-all ${
        onClick ? 'cursor-pointer hover:shadow-soft-hover' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={springBounce}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg} shadow-sm`}
        >
          {Icon && <Icon size={26} />}
        </motion.div>
        {change !== undefined && (
          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            {change}
          </span>
        )}
      </div>
      <div>
        <KineticLine
          as="p"
          delay={0.04}
          className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1"
        >
          {title}
        </KineticLine>
        <div className="flex items-baseline gap-1 mt-0.5">
          <KineticNumber
            value={value}
            suffix={suffix}
            className="text-3xl font-extrabold text-slate-800 tracking-tight"
          />
        </div>
      </div>
    </motion.div>
  );
};
