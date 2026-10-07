import React from 'react';
import { LogoMark } from './Logo';

export default function FullPageLoader({ label = 'Getting things ready…' }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-canvas">
      <LogoMark className="h-14 w-14 animate-float" />
      <p className="text-sm font-medium text-ink-soft animate-fade-in">{label}</p>
    </div>
  );
}
