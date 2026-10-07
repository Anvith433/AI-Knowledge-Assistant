import React, { useMemo } from 'react';
import { FilePlus2, LogOut, MessageCircle, X } from 'lucide-react';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import Spinner from '../ui/Spinner';
import ThemeToggle from '../ui/ThemeToggle';
import DocumentCard from './DocumentCard';
import { useFilePicker } from './UploadDropzone';
import { dayLabel } from '../../utils/format';

function SectionTitle({ children, aside }) {
  return (
    <div className="mb-2.5 flex items-center justify-between px-1">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">{children}</h2>
      {aside}
    </div>
  );
}

function ConversationList({ messages, onSelect }) {
  const groups = useMemo(() => {
    const ordered = [...messages].reverse();
    const map = new Map();
    ordered.forEach((m) => {
      const label = dayLabel(m.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(m);
    });
    return [...map.entries()];
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-4 py-5 text-center">
        <MessageCircle className="mx-auto h-5 w-5 text-ink-faint" />
        <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">Your questions will show up here so you can revisit them anytime.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="mb-1 px-2 text-xs font-medium text-ink-faint">{label}</p>
          <ul className="space-y-0.5">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onSelect(m.id)}
                  className="w-full truncate rounded-lg px-2 py-2 text-left text-[13.5px] text-ink-soft transition hover:bg-sunken hover:text-ink"
                  title={m.question}
                >
                  {m.question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Sidebar({
  user,
  document,
  docLoading,
  isUploading,
  messages,
  onUpload,
  onDeleteClick,
  onSelectMessage,
  onSignOut,
  open,
  onClose,
}) {
  const picker = useFilePicker(onUpload);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-6 pt-5">
        <Logo />
        <button onClick={onClose} className="icon-btn lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="scroll-soft flex-1 space-y-7 overflow-y-auto px-4 pb-4">
        <section>
          <SectionTitle>Your document</SectionTitle>
          {docLoading ? (
            <div className="h-[118px] animate-pulse rounded-2xl bg-sunken" />
          ) : document ? (
            <DocumentCard document={document} onDeleteClick={onDeleteClick} />
          ) : (
            <button
              onClick={picker.open}
              disabled={isUploading}
              className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-line bg-surface/60 p-3.5 text-left transition hover:border-accent/50 hover:bg-accent-soft/40 disabled:cursor-wait"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                {isUploading ? <Spinner /> : <FilePlus2 className="h-5 w-5" />}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{isUploading ? 'Reading your PDF…' : 'Add a PDF'}</span>
                <span className="block text-xs text-ink-faint">{isUploading ? 'Hang tight' : 'One document at a time'}</span>
              </span>
              {picker.input}
            </button>
          )}
        </section>

        <section>
          <SectionTitle aside={messages.length > 0 && <span className="text-[11px] text-ink-faint">{messages.length}</span>}>
            Conversation
          </SectionTitle>
          <ConversationList messages={messages} onSelect={onSelectMessage} />
        </section>
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar name={user?.fullName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user?.fullName}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
          </div>
          <ThemeToggle />
          <button onClick={onSignOut} className="icon-btn hover:text-danger" aria-label="Sign out" title="Sign out">
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-[300px] shrink-0 border-r border-line bg-canvas lg:block">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-[320px] bg-canvas shadow-lift animate-slide-in-left">{content}</aside>
        </div>
      )}
    </>
  );
}
