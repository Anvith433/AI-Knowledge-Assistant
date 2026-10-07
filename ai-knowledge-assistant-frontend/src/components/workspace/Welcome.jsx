import React from 'react';
import { BookOpen, Lightbulb, ListChecks, MessageSquareQuote } from 'lucide-react';
import { greeting } from '../../utils/format';

const SUGGESTIONS = [
  { icon: BookOpen, title: 'Summarize it for me', prompt: 'Can you give me a short summary of this document?' },
  { icon: Lightbulb, title: 'Key takeaways', prompt: 'What are the most important takeaways from this document?' },
  { icon: MessageSquareQuote, title: 'Explain it simply', prompt: "Explain the main ideas of this document as if I'm new to the topic." },
  { icon: ListChecks, title: 'Facts & figures', prompt: 'List the important dates, numbers and facts mentioned in this document.' },
];

export default function Welcome({ userName, documentName, onPick, disabled }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-1 py-8 text-center animate-fade-up sm:py-14">
      <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-[42px] sm:leading-[1.1]">
        {greeting()}, <span className="text-gradient italic">{userName}</span>
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        I've finished reading <span className="font-semibold text-ink">{documentName}</span>. What would you like to know?
      </p>

      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, title, prompt }, i) => (
          <button
            key={title}
            onClick={() => onPick(prompt)}
            disabled={disabled}
            className="group flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift disabled:opacity-50 animate-fade-up"
            style={{ animationDelay: `${100 + i * 70}ms` }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-accent-contrast">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{title}</span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-faint">{prompt}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
