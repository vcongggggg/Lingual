'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-black uppercase tracking-wider text-ink">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full bg-[#FFFDF6] border-2 border-ink rounded-xl px-4 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-red focus:border-ink shadow-brutal-sm transition-all duration-100 ${
            error ? 'border-red ring-2 ring-red/30' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-bold text-red">{error}</span>}
        {helperText && !error && <span className="text-xs text-ink-soft">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
