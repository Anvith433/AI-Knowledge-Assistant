import React from 'react';

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow ${className}`}>
      <svg viewBox="0 0 64 64" className="h-[62%] w-[62%]" aria-hidden="true">
        <path
          d="M30 6c1.8 12.9 7.4 18.5 20.3 20.3C37.4 28.1 31.8 33.7 30 46.6 28.2 33.7 22.6 28.1 9.7 26.3 22.6 24.5 28.2 18.9 30 6z"
          fill="white"
        />
        <circle cx="49" cy="49" r="6" fill="white" opacity="0.85" />
      </svg>
    </span>
  );
}

export default function Logo({ subtitle = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark />
      <div className="leading-tight">
        <p className="font-display text-xl font-semibold tracking-tight text-ink">Lumen</p>
        {subtitle && <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">Knowledge Assistant</p>}
      </div>
    </div>
  );
}
