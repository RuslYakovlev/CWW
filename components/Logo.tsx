import React from 'react';
import { motion } from 'framer-motion';

// FIX: Add a 'light' prop to allow changing the stroke color for use on dark backgrounds.
const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = "w-10 h-10", light = false }) => {
  const strokeColor = light ? 'white' : '#1A1A1A';
  return (
    <motion.div 
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 32 32"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M11 5C7.13401 5 4 9.47715 4 16C4 22.5228 7.13401 27 11 27"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.path
          d="M21 5C24.866 5 28 9.47715 28 16C28 22.5228 24.866 27 21 27"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
            style={{ transformOrigin: 'center' }}
        >
            <circle
              cx="16"
              cy="16"
              r="5"
              fill="#D4A373"
            />
            <path
              d="M16 14V18M14 16H18"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default Logo;