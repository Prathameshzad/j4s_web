import React from 'react';
import { Badge } from './CustomUI';

const StatsCard = ({
  icon: Icon,
  title,
  value,
  status,
  statusVariant = 'primary',
  trend,
  trendVariant = 'success',
  iconColor = '#f97316',
  iconBg = 'bg-primary/5'
}) => {
  return (
    <div className="bg-white dark:bg-tertiary p-6 rounded-md border border-border shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-350 flex flex-col justify-between h-full group min-h-[160px]">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-md ${iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {Icon && <Icon size={22} style={{ color: iconColor }} />}
        </div>
        {status && (
          <Badge variant={statusVariant} className="text-[10px] px-2.5 h-6 flex items-center font-bold">
            {status}
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[13px] font-semibold text-slate-500">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-tertiary dark:text-white tracking-tight font-header">
          {value}
        </h2>
        {trend && (
          <p className="pt-2 text-[11px] font-semibold text-slate-400 tracking-wide flex items-center gap-1.5 border-t border-slate-50 mt-2">
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
