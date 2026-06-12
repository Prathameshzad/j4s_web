import React from 'react';
import { Badge } from '../ui/CustomUI';

const STATUS_MAP = {
  DRAFT: { label: 'Draft', variant: 'warning' },
  PUBLISHED: { label: 'Published', variant: 'success' },
};

export default function ExamStatusBadge({ status, className = '' }) {
  const config = STATUS_MAP[status] || { label: status, variant: 'secondary' };
  return (
    <Badge variant={config.variant} className={`text-[10px] font-bold tracking-wide ${className}`}>
      {config.label}
    </Badge>
  );
}
