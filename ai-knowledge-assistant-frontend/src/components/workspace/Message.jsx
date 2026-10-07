import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { LogoMark } from '../ui/Logo';
import { formatTime, relativeDay } from '../../utils/format';

export function UserBubble({ text, userName, time }) {
  return (
    <div className="flex items-end justify-end gap-3 animate-fade-up">
      <div className="flex max-w-[85%] flex-col items-end sm:max-w-[75%]">
        <div className="whitespace-pre-wrap break-words rounded-3xl rounded-br-lg bg-ink px-4 py-3 text-[15px] leading-relaxed text-canvas shadow-soft">
          {text}
        </div>
        {time && <span className="mt-1.5 pr-1 text-[11px] text-ink-faint">{time}</span>}
      </div>
      <Avatar name={userName} className="hidden h-8 w-8 text-xs sm:inline-flex" />
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-faint transition hover:bg-sunken hover:text-ink"
      aria-label={copied ? 'Copied' : 'Copy answer'}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function AssistantMessage({ text }) {
  return (
    <div className="flex items-start gap-3 animate-fade-up">
      <LogoMark className="mt-0.5 h-8 w-8 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-[13px] font-semibold text-ink">Lumen</p>
        <div className="prose prose-sm answer-prose max-w-none sm:prose-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
        <div className="mt-2 -ml-2 flex items-center">
          <CopyButton text={text} />
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-up" aria-live="polite">
      <LogoMark className="mt-0.5 h-8 w-8 rounded-[10px]" />
      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-ink">Lumen</p>
        <div className="flex items-center gap-3 text-sm text-ink-faint">
          <span className="flex gap-1.5 rounded-full border border-line bg-surface px-3 py-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent animate-blink" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
          Looking through your document…
        </div>
      </div>
    </div>
  );
}

export function MessagePair({ message, userName, showDay }) {
  return (
    <div id={`msg-${message.id}`} className="scroll-mt-24 space-y-6">
      {showDay && (
        <div className="flex items-center gap-3 pt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
          <span className="h-px flex-1 bg-line" />
          {relativeDay(message.createdAt)}
          <span className="h-px flex-1 bg-line" />
        </div>
      )}
      <UserBubble text={message.question} userName={userName} time={formatTime(message.createdAt)} />
      <AssistantMessage text={message.answer} />
    </div>
  );
}
