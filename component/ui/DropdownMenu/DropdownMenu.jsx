'use client';

import React, { useState, useRef, useEffect } from 'react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left w-full" ref={containerRef}>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {React.ReactElement} [props.render]
 * @param {() => void} [props.onClick]
 */
export const DropdownMenuTrigger = ({ children, render, onClick }) => {
  const props = { onClick, ...(children?.props || {}) };
  if (render) return React.cloneElement(render, props);
  return <div className="cursor-pointer" onClick={onClick}>{children}</div>;
};

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {any} [props.align]
 * @param {any} [props.side]
 * @param {any} [props.sideOffset]
 */
export const DropdownMenuContent = ({ children, className = '', ...props }) => (
  <div className={`absolute z-50 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {() => void} [props.onClick]
 * @param {string} [props.className]
 */
export const DropdownMenuItem = ({ children, onClick, className = '', ...props }) => (
  <div onClick={onClick} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer dark:text-gray-200 dark:hover:bg-slate-800 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const DropdownMenuLabel = ({ children, className = '', ...props }) => <div className={`px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider ${className}`} {...props}>{children}</div>;

/**
 * @param {Object} props
 * @param {string} [props.className]
 */
export const DropdownMenuSeparator = ({ className = '' }) => <div className={`h-px bg-gray-200 dark:bg-slate-700 my-1 ${className}`} />;

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 */
export const DropdownMenuGroup = ({ children, ...props }) => <div {...props}>{children}</div>;
