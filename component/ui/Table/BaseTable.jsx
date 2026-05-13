import React from 'react';
import '../ui.css';

export const Table = ({ children, className = '' }) => (
  <div className="w-full overflow-auto scrollbar-hide">
    <table className={`w-full border-collapse text-left ${className}`}>{children}</table>
  </div>
);

export const TableHeader = ({ children, className = '' }) => (
  <thead className={`bg-muted/30 border-b border-border/50 ${className}`}>{children}</thead>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-border/30 ${className}`}>{children}</tbody>
);

export const TableRow = ({ children, className = '' }) => (
  <tr className={`transition-colors duration-200 hover:bg-primary/[0.02] group/row ${className}`}>
    {children}
  </tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[2px] align-middle ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-8 py-5 text-sm font-bold text-foreground/80 align-middle tracking-tight ${className}`}>
    {children}
  </td>
);
