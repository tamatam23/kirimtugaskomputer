import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { typographyContainer, typographyWord, typographySlideUp, easeFluid } from '../../utils/motion';

/**
 * KineticText - Breaks text into words with fluid kinetic slide-up & blur reveal
 */
export const KineticText = ({
  text = '',
  as = 'span',
  className = '',
  stagger = 0.03,
  delay = 0.04,
  children,
}) => {
  const raw = text !== undefined && text !== null && text !== '' ? text : children;
  const content = typeof raw === 'string' ? raw : raw !== undefined && raw !== null ? String(raw) : '';
  const Component = motion[as] || motion.span;

  if (!content) {
    return (
      <Component
        variants={typographySlideUp}
        initial="hidden"
        animate="show"
        className={className}
      >
        {children}
      </Component>
    );
  }

  const words = content.split(' ');

  const customContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <Component
      variants={customContainer}
      initial="hidden"
      animate="show"
      className={`inline ${className}`}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-baseline">
          <motion.span
            variants={typographyWord}
            className="inline-block transform-gpu"
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
};

/**
 * KineticLine - Fluid slide-up animation for subtitles, badges, card details & paragraphs
 */
export const KineticLine = ({
  children,
  as = 'div',
  className = '',
  delay = 0.06,
}) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 12, filter: 'blur(1.5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.52,
        delay,
        ease: easeFluid,
      }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </Component>
  );
};

/**
 * KineticNumber - Mesmerizing fluid rolling counter from 0 to value on page load
 */
export const KineticNumber = ({ value = 0, suffix = '', className = '' }) => {
  const numericVal = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 750; // ms
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo for ultra-smooth natural deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayVal(Math.round(easeProgress * numericVal));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [numericVal]);

  return (
    <div className="overflow-hidden inline-flex items-baseline gap-1">
      <motion.span
        initial={{ opacity: 0, y: 14, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: easeFluid,
        }}
        className={`inline-block font-extrabold tracking-tight transform-gpu ${className}`}
      >
        {displayVal}
      </motion.span>
      {suffix && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: easeFluid }}
          className="text-sm font-semibold text-slate-500"
        >
          {suffix}
        </motion.span>
      )}
    </div>
  );
};
