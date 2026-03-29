'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit';
}

const variants = {
  primary: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-900/30',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-100 border border-zinc-600',
  danger: 'bg-red-900/60 hover:bg-red-900/80 active:bg-red-900 text-red-200 border border-red-800',
  ghost: 'bg-transparent hover:bg-zinc-800/50 active:bg-zinc-800 text-zinc-300',
};

const sizes = {
  sm: 'h-10 px-4 text-sm gap-1.5',
  md: 'h-12 px-6 text-base gap-2',
  lg: 'h-14 px-8 text-lg gap-2.5',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-colors duration-150 select-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
