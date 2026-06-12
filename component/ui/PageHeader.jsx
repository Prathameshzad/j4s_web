import React from 'react';

export const PageHeader = ({ title, subtitle, icon: Icon, actions = [] }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 mb-4 border-b border-border">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon size={18} className="text-primary" />}
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide">Administrative Module</span>
        </div>
        <h1 className="text-5xl font-medium text-tertiary dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-400 text-base font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {actions.map((action, idx) => (
          <React.Fragment key={idx}>
            {action}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
