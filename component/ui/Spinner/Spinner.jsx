import React from 'react';

export const Spinner = ({ className = '' }) => (
  <div className={`w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin ${className}`}></div>
);
