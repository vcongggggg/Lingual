'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'ink' | 'paper' | 'teal' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'white', size = 'md', children, className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
      md: 'px-5 py-2.5 text-sm font-extrabold rounded-xl',
      lg: 'px-7 py-3.5 text-base font-black rounded-2xl',
    }[size];

    const variantClasses = {
      white: 'bg-white text-ink hover:bg-paper',
      red: 'bg-red text-white hover:bg-red-dark',
      ink: 'bg-ink text-paper hover:bg-black',
      paper: 'bg-paper-2 text-ink hover:bg-[#E8DFCB]',
      teal: 'bg-teal text-white hover:bg-teal-dark',
    }[variant];

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 border-2 border-ink shadow-brutal hover:shadow-brutal-lg active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
