import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-charcoal-light dark:text-gray-400 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light dark:text-gray-500 group-focus-within:text-gold transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              // Base & Light Mode
              "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-charcoal placeholder:text-gray-400 transition-all duration-200",
              // Dark Mode
              "dark:bg-charcoal dark:border-gray-700 dark:text-white dark:placeholder:text-gray-600",
              // Focus & Hover
              "focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none hover:border-gold/50 dark:hover:border-gold/50",
              // Icon padding
              icon && "pl-10",
              // Error state
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error ml-1 animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";