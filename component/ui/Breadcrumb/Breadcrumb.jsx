import React from 'react';

export const Breadcrumb = ({ children }) => <nav className="flex" aria-label="Breadcrumb">{children}</nav>;

export const BreadcrumbList = ({ children }) => <ol className="flex items-center space-x-2">{children}</ol>;

export const BreadcrumbItem = ({ children }) => <li className="flex items-center">{children}</li>;

export const BreadcrumbLink = ({ children, href }) => <a href={href} className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">{children}</a>;

export const BreadcrumbPage = ({ children }) => <span className="text-sm font-bold text-slate-900 dark:text-white">{children}</span>;

export const BreadcrumbSeparator = () => <span className="mx-2 text-slate-400 text-xs">/</span>;
