import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Spinner from '../ui/Spinner';

const MAX_HEIGHT = 200;

const Composer = forwardRef(function Composer({ onSend, disabled, isAsking }, ref) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  // Grow with the content, up to a comfortable maximum
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled && !isAsking;

  const submit = async (e) => {
    e?.preventDefault();
    if (!canSend) return;
    const draft = value;
    setValue('');
    const ok = await onSend(draft);
    // Give the question back if it failed, so nothing is lost
    if (!ok) setValue((current) => current || draft);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-3xl">
      <div
        className={`flex items-end gap-2 rounded-[22px] border bg-surface p-2 pl-4 shadow-lift transition focus-within:border-accent/60 focus-within:ring-4 focus-within:ring-accent/10 ${
          disabled ? 'border-line opacity-70' : 'border-line'
        }`}
      >
        <label htmlFor="composer" className="sr-only">
          Ask a question
        </label>
        <textarea
          id="composer"
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Add a PDF first, then ask me anything about it…' : 'Ask anything about your document…'}
          className="scroll-soft max-h-[200px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-contrast shadow-glow transition hover:bg-accent-strong active:scale-95 disabled:bg-line disabled:text-ink-faint disabled:shadow-none"
          aria-label="Send question"
        >
          {isAsking ? <Spinner className="h-[18px] w-[18px]" /> : <ArrowUp className="h-5 w-5" strokeWidth={2.4} />}
        </button>
      </div>
      <p className="mt-2 hidden text-center text-[11.5px] text-ink-faint sm:block">
        <kbd className="font-sans font-semibold">Enter</kbd> to send · <kbd className="font-sans font-semibold">Shift + Enter</kbd> for a
        new line · Answers come from your document, so double-check anything important.
      </p>
    </form>
  );
});

export default Composer;
