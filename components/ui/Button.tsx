import React from 'react';
// FIX: Implemented a polymorphic component with discriminated unions to correctly type props 
// for both '<button>' and '<a>' elements, resolving type conflicts with framer-motion props.
import { motion, HTMLMotionProps } from 'framer-motion';

// Define base props common to both button and anchor
interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

// Define props for when the component is a button
type ButtonAsButton = ButtonBaseProps & { as?: 'button'; href?: never } & Omit<HTMLMotionProps<'button'>, keyof ButtonBaseProps>;

// Define props for when the component is an anchor
type ButtonAsAnchor = ButtonBaseProps & { as: 'a' } & Omit<HTMLMotionProps<'a'>, keyof ButtonBaseProps>;

// The final props type is a union of the two
type ButtonProps = ButtonAsButton | ButtonAsAnchor;


const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', as = 'button', ...props }) => {
  const baseClasses = 'px-8 py-4 rounded-full font-semibold text-base tracking-wide transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    secondary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-md shadow-accent/20',
    outline: 'bg-transparent border border-text/20 text-text hover:bg-text hover:text-white',
  };

  // FIX: Use 'as const' to ensure TypeScript infers the most specific type for the transition property,
  // resolving the 'string is not assignable to AnimationGeneratorType' error.
  const motionProps = {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  } as const;

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (as === 'a') {
    return (
      <motion.a className={combinedClasses} {...motionProps} {...(props as HTMLMotionProps<'a'>)}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button className={combinedClasses} {...motionProps} {...(props as HTMLMotionProps<'button'>)}>
      {children}
    </motion.button>
  );
};

export default Button;