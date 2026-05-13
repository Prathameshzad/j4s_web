import React from 'react';
import '../ui.css';

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary' | 'outline'} [props.variant]
 * @param {string} [props.className]
 */
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    error: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    warning: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    info: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    neutral: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
    primary: "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:border-primary/20",
    outline: "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 dark:text-slate-400"
  };

  const variantClass = variants[variant] || variants.primary;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[10px] border ${variantClass} ${className}`}>
      {children}
    </span>
  );
};
