import React, { useRef, useState } from 'react';
import { FileUp, Sparkles, UploadCloud } from 'lucide-react';
import Spinner from '../ui/Spinner';

const STEPS = [
  { title: 'Drop in a PDF', text: 'Reports, papers, manuals, notes — up to 50 MB.' },
  { title: 'I read every page', text: 'The text is split into passages and indexed.' },
  { title: 'Ask like a human', text: 'Get clear answers drawn straight from your file.' },
];

export function useFilePicker(onFile) {
  const inputRef = useRef(null);
  const input = (
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,application/pdf"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (file) onFile(file);
      }}
    />
  );
  return { open: () => inputRef.current?.click(), input };
}

export default function UploadDropzone({ onUpload, isUploading, progress, userName }) {
  const [dragActive, setDragActive] = useState(false);
  const picker = useFilePicker(onUpload);
  const isProcessing = isUploading && progress >= 100;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    handleDrag(e);
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !isUploading) onUpload(file);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-1 py-6 text-center animate-fade-up sm:py-10">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft shadow-soft">
        <Sparkles className="h-3.5 w-3.5 text-peach" /> Let's get started
      </span>
      <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-[42px] sm:leading-[1.1]">
        Hi {userName}, what would you like to <span className="text-gradient italic">read</span> today?
      </h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
        Share a PDF with me and I'll read it cover to cover, so you can ask questions in plain language.
      </p>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a PDF document"
        onClick={() => !isUploading && picker.open()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !isUploading && picker.open()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`group relative mt-8 w-full cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 transition-all duration-300 sm:p-10 ${
          dragActive
            ? 'scale-[1.01] border-accent bg-accent-soft'
            : 'border-line bg-surface hover:border-accent/50 hover:bg-accent-soft/40'
        } ${isUploading ? 'cursor-default' : ''}`}
      >
        {picker.input}

        {isUploading ? (
          <div className="flex flex-col items-center gap-4" aria-live="polite">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Spinner className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-ink">{isProcessing ? 'Reading and indexing your document…' : 'Uploading your file…'}</p>
              <p className="mt-1 text-sm text-ink-faint">
                {isProcessing ? 'Longer documents can take a minute. Thanks for your patience!' : `${progress}% uploaded`}
              </p>
            </div>
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full bg-brand-gradient transition-all duration-500 ${isProcessing ? 'w-full animate-pulse' : ''}`}
                style={isProcessing ? undefined : { width: `${Math.max(progress, 4)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow transition-transform duration-300 group-hover:-translate-y-1">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-ink">{dragActive ? 'Let go to upload' : 'Drag & drop your PDF here'}</p>
              <p className="mt-1 text-sm text-ink-faint">or click to browse your files</p>
            </div>
            <span className="btn-outline pointer-events-none mt-1">
              <FileUp className="h-4 w-4" /> Choose a PDF
            </span>
          </div>
        )}
      </div>

      <ol className="mt-10 grid w-full gap-4 text-left sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3 sm:flex-col sm:gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-sm font-semibold text-accent">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{step.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-faint">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
