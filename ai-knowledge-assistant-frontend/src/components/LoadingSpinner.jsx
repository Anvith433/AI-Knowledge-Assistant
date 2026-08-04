import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', label = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center gap-3 text-blue-400">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin`} />
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
    </div>
  );
}