import React from 'react';
import '../ui.css';

export const Card = ({ children, className = '', ...props }) => {
  const hasBg = className.includes('bg-');
  return (
    <div 
      className={`${!hasBg ? 'bg-white dark:bg-slate-900' : ''} rounded-md border border-border shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 border-b border-slate-50 dark:border-slate-800 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-bold text-slate-900 dark:text-white tracking-tight font-header ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider ${className}`}>{children}</p>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 border-t border-slate-50 dark:border-slate-800 ${className}`}>{children}</div>
);
