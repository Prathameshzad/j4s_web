import React from 'react';

export const Label = ({ children, className = '', ...props }) => (
  <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block ${className}`} {...props}>
    {children}
  </label>
);
