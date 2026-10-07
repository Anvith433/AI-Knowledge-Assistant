import React from 'react';
import { BookOpenCheck, Lock, MessagesSquare } from 'lucide-react';
import Logo, { LogoMark } from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';

const HIGHLIGHTS = [
  { icon: BookOpenCheck, text: 'Answers grounded in your own documents' },
  { icon: MessagesSquare, text: 'Your conversations, saved and private to you' },
  { icon: Lock, text: 'Runs on your own models — nothing leaves your setup' },
];

function PreviewChat() {
  return (
    <div className="relative mx-auto w-full max-w-md space-y-3">
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm text-canvas shadow-soft animate-fade-up">
        What are the three biggest takeaways from this report?
      </div>
      <div className="flex items-end gap-2.5 animate-fade-up [animation-delay:250ms]">
        <LogoMark className="h-8 w-8" />
        <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-soft shadow-soft">
          Happy to help! In short: <span className="font-semibold text-ink">revenue grew 18%</span>, customer churn halved after the
          onboarding redesign, and the team recommends expanding into two new regions next year.
        </div>
      </div>
      <div className="flex items-center gap-2.5 pl-1 animate-fade-up [animation-delay:500ms]">
        <span className="h-8 w-8" />
        <div className="flex gap-1.5 rounded-full border border-line bg-surface px-3 py-2 shadow-soft">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent animate-blink" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-[100dvh] bg-canvas">
      {/* Story panel */}
      <aside className="relative hidden w-[46%] max-w-[680px] flex-col justify-between overflow-hidden border-r border-line bg-sunken p-10 lg:flex xl:p-14">
        <div className="paper-grain absolute inset-0" aria-hidden="true" />
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-peach/25 blur-3xl" aria-hidden="true" />

        <Logo className="relative" />

        <div className="relative space-y-10">
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink xl:text-5xl">
              Every document
              <br />
              has a story.
              <br />
              <span className="text-gradient italic">Just ask it.</span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
              Upload a PDF and talk to it like you would a well-read friend. Lumen reads every page so you don't have to.
            </p>
          </div>
          <PreviewChat />
        </div>

        <ul className="relative space-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-ink-soft">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Logo subtitle={false} className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-[400px] animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}
