import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = "w-10 h-10", light = false }) => {
  return (
    <motion.div 
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src="/logo.png"
        alt="Church Without Walls Logo"
        className="w-full h-full object-contain"
        style={{ filter: light ? 'brightness(0) invert(1)' : 'none' }}
        onError={(e) => {
          // Fallback if logo.png is not uploaded yet
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%231D8A99' d='M50 0 L100 50 L50 100 L0 50 Z'/%3E%3C/svg%3E";
        }}
      />
    </motion.div>
  );
};

export default Logo;