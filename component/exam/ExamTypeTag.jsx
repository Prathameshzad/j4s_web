import React from 'react';

const TYPE_MAP = {
  UNIT_TEST:   { label: 'Unit Test',    color: 'bg-blue-50 text-blue-600 border-blue-100' },
  MID_TERM:    { label: 'Mid Term',     color: 'bg-purple-50 text-purple-600 border-purple-100' },
  QUARTERLY:   { label: 'Quarterly',   color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  HALF_YEARLY: { label: 'Half Yearly', color: 'bg-teal-50 text-teal-600 border-teal-100' },
  FINAL:       { label: 'Final',       color: 'bg-rose-50 text-rose-600 border-rose-100' },
  PRE_BOARD:   { label: 'Pre Board',   color: 'bg-amber-50 text-amber-600 border-amber-100' },
  CUSTOM:      { label: 'Custom',      color: 'bg-slate-50 text-slate-600 border-slate-100' },
};

export default function ExamTypeTag({ type, className = '' }) {
  const config = TYPE_MAP[type] || { label: type, color: 'bg-slate-50 text-slate-600 border-slate-100' };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide border ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}
