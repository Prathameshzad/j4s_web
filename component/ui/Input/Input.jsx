import React from 'react';
import '../ui.css';

/**
 * @param {Object} props
 * @param {string} [props.className]
 */
export const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full h-14 bg-background border border-border/60 rounded-2xl px-6 font-bold text-foreground placeholder:text-muted-foreground/40 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[2px] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 focus:shadow-xl transition-all duration-300 ${className}`} 
    {...props} 
  />
);

/**
 * @param {Object} props
 * @param {string} [props.className]
 */
export const Textarea = ({ className = '', ...props }) => (
  <textarea 
    className={`w-full bg-background border border-border/60 rounded-[32px] p-6 font-bold text-foreground placeholder:text-muted-foreground/40 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[2px] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 focus:shadow-xl transition-all duration-300 min-h-[120px] ${className}`} 
    {...props} 
  />
);
