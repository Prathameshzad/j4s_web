import React from 'react';

export const Separator = ({ className = '', orientation = 'horizontal' }) => (
  <div className={`${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'} bg-gray-200 dark:bg-slate-700 my-4 ${className}`} />
);

export const ScrollArea = ({ children, className = '' }) => (
  <div className={`overflow-auto ${className}`}>{children}</div>
);
