'use client';

import * as React from 'react';
import { X } from 'lucide-react';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto outline-none focus:outline-none">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative w-auto my-6 mx-auto max-w-3xl z-50 animate-in fade-in zoom-in duration-200">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-[2.5rem] shadow-2xl outline-none focus:outline-none overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`relative p-0 flex-auto ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 ${className}`}>
    {children}
  </div>
);

const DialogFooter = ({ children, className = "" }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t border-slate-100 ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
};
