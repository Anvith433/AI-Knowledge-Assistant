import React from 'react';

export const scorePassword = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, password.length < 8 ? Math.min(score, 1) : score);
};

const LEVELS = [
  { label: 'Too short', color: 'bg-danger', text: 'text-danger' },
  { label: 'Weak', color: 'bg-danger', text: 'text-danger' },
  { label: 'Okay', color: 'bg-warning', text: 'text-warning' },
  { label: 'Good', color: 'bg-success', text: 'text-success' },
  { label: 'Strong', color: 'bg-success', text: 'text-success' },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="mt-2 flex items-center gap-3 animate-fade-in" aria-live="polite">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${score >= step ? level.color : 'bg-line'}`} />
        ))}
      </div>
      <span className={`w-16 text-right text-xs font-semibold ${level.text}`}>{level.label}</span>
    </div>
  );
}
