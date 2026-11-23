// Framer Motion Spring & Bounce Presets (Fluid & Organic)

export const springBounce = {
  type: "spring",
  stiffness: 350,
  damping: 20,
};

export const springSmooth = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.7,
};

// Fluid & Punchy Spring (Natural elasticity, lively bounce without robotic stiffness)
export const springPunchy = {
  type: "spring",
  stiffness: 280,
  damping: 22,
  mass: 0.75,
};

// The gold standard fluid decelerate curve (Apple & Linear design system)
export const easeFluid = [0.16, 1, 0.3, 1];

export const cardHoverMotion = {
  whileHover: { y: -6, scale: 1.015 },
  whileTap: { scale: 0.97 },
  transition: springBounce,
};

export const buttonTapMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.96 },
  transition: springBounce,
};

export const iconHoverMotion = {
  whileHover: { scale: 1.15, rotate: 6 },
  whileTap: { scale: 0.9 },
  transition: springBounce,
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

// Distinct Staggered Container for Cards: distinct, snappy ripple sequence
export const staggerCards = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

// Fast Staggered Container for Grids with Many Items (e.g. Gallery)
export const staggerFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// Fluid Pop Card Entrance: crisp, tactile, with natural pop & smooth vertical snap
export const popCard = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springPunchy,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.15 },
  },
};

// Kinetic Typography Container
export const typographyContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.03,
    },
  },
};

// Kinetic Word Reveal (Fluid motion, no mechanical jitter)
export const typographyWord = {
  hidden: { opacity: 0, y: "90%", filter: "blur(2px)" },
  show: {
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: {
      duration: 0.52,
      ease: easeFluid,
    },
  },
};

// Smooth Kinetic Typography Slide Up (for lines, headings, and labels)
export const typographySlideUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(1.5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: easeFluid,
    },
  },
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: springSmooth 
  },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.18 } },
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 320, damping: 24 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.94, 
    y: 12, 
    transition: { duration: 0.16 } 
  },
};

// Page Transition for menu switching
export const pageTransition = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: easeFluid,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.995,
    transition: {
      duration: 0.14,
      ease: [0.4, 0, 1, 1],
    },
  },
};
