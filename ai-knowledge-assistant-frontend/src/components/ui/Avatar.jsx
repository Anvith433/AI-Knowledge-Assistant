import React from 'react';

export const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?';

export default function Avatar({ name, className = 'h-9 w-9 text-sm' }) {
  return (
    <span
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-peach/90 to-accent/80 font-semibold text-white ring-2 ring-surface ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
