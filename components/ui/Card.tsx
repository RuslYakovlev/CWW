import React from 'react';
// FIX: Import TargetAndTransition for correct prop typing.
import { motion, TargetAndTransition } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Use the specific TargetAndTransition type instead of the generic 'object'.
  whileHover?: TargetAndTransition;
}

const Card: React.FC<CardProps> = ({ children, className = '', whileHover }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={whileHover || { y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
      className={`bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;