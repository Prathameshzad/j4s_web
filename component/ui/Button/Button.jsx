import React from 'react';
import '../ui.css';

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {'primary' | 'outline' | 'ghost' | 'danger' | 'secondary'} [props.variant]
 * @param {'default' | 'sm' | 'lg' | 'icon'} [props.size]
 * @param {string} [props.className]
 * @param {React.ReactElement} [props.render]
 * @param {boolean} [props.disabled]
 * @param {'submit' | 'button' | 'reset'} [props.type]
 * @param {() => void} [props.onClick]
 */
export const Button = ({ children, variant = 'primary', size = 'default', className = '', render, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-widest text-[11px] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 rounded-2xl",
    outline: "border border-border/60 bg-background shadow-sm hover:shadow-xl hover:bg-muted/50 rounded-2xl text-foreground",
    ghost: "bg-transparent hover:bg-muted/50 rounded-2xl text-foreground",
    danger: "bg-red-500 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/30 rounded-2xl",
    secondary: "bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 rounded-2xl"
  };

  const sizes = {
    default: "h-14 px-8",
    sm: "h-10 px-5 text-[10px]",
    lg: "h-16 px-10 text-[12px]",
    icon: "h-12 w-12"
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.default;
  const combinedClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`;

  if (render) {
    return React.cloneElement(render, {
      className: `${combinedClasses} ${render.props.className || ''}`,
      ...props,
      children: children || render.props.children
    });
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
