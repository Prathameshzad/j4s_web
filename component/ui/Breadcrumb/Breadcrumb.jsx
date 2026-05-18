import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Breadcrumb = ({ children, className, ...props }) => <nav className={cn("flex", className)} aria-label="Breadcrumb" {...props}>{children}</nav>;

export const BreadcrumbList = ({ children, className, ...props }) => <ol className={cn("flex items-center space-x-2", className)} {...props}>{children}</ol>;

export const BreadcrumbItem = ({ children, className, ...props }) => <li className={cn("flex items-center", className)} {...props}>{children}</li>;

export const BreadcrumbLink = ({ children, href, className, asChild, ...props }) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...props,
            className: cn("text-sm font-medium text-slate-500 hover:text-primary transition-colors", className, children.props.className)
        });
    }
    return <Link href={href || '#'} className={cn("text-sm font-medium text-slate-500 hover:text-primary transition-colors", className)} {...props}>{children}</Link>;
};

export const BreadcrumbPage = ({ children, className, ...props }) => <span className={cn("text-sm font-bold text-slate-900 dark:text-white", className)} {...props}>{children}</span>;

export const BreadcrumbSeparator = ({ children, className, ...props }) => <span className={cn("mx-2 text-slate-400 text-xs", className)} {...props}>{children || '/'}</span>;
