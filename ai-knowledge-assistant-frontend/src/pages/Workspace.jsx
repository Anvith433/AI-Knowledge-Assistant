import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, Menu } from 'lucide-react';
import Sidebar from '../components/workspace/Sidebar';
import UploadDropzone from '../components/workspace/UploadDropzone';
import Welcome from '../components/workspace/Welcome';
import Composer from '../components/workspace/Composer';
import DeleteDialog from '../components/workspace/DeleteDialog';
import { MessagePair, TypingIndicator, UserBubble } from '../components/workspace/Message';
import { LogoMark } from '../components/ui/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocument } from '../hooks/useDocument';
import { useChat } from '../hooks/useChat';
import { dayLabel, firstName } from '../utils/format';

function ThreadSkeleton() {
  return (
    <div className="space-y-8 py-6" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-5">
          <div className="ml-auto h-11 w-2/3 animate-pulse rounded-3xl bg-sunken sm:w-1/2" />
          <div className="flex gap-3">
            <div className="h-8 w-8 animate-pulse rounded-[10px] bg-sunken" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-full animate-pulse rounded-full bg-sunken" />
              <div className="h-3.5 w-11/12 animate-pulse rounded-full bg-sunken" />
              <div className="h-3.5 w-3/5 animate-pulse rounded-full bg-sunken" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Workspace() {
  const { user, signOut } = useAuth();
  const notify = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const scrollRef = useRef(null);
  const composerRef = useRef(null);

  const {
    document: activeDoc,
    loading: docLoading,
    isUploading,
    uploadProgress,
    isDeleting,
    fetchDocument,
    uploadDocument,
    deleteDocument,
  } = useDocument(notify);

  const { messages, pendingQuestion, isAsking, loading: chatLoading, askQuestion, fetchHistory, clearMessages } = useChat(notify);

  useEffect(() => {
    fetchDocument();
    fetchHistory();
  }, [fetchDocument, fetchHistory]);

  // Keep the newest message in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, pendingQuestion]);

  const handleUpload = useCallback(
    async (file) => {
      setDrawerOpen(false);
      const ok = await uploadDocument(file);
      if (ok) setTimeout(() => composerRef.current?.focus(), 100);
      return ok;
    },
    [uploadDocument]
  );

  const handleConfirmDelete = async () => {
    if (!activeDoc) return;
    const ok = await deleteDocument(activeDoc.id);
    if (ok) {
      setIsDeleteOpen(false);
      clearMessages();
    }
  };

  const handleSelectMessage = (id) => {
    setDrawerOpen(false);
    window.document.getElementById(`msg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSignOut = () => {
    signOut();
    notify("You've been signed out. See you soon!", 'info');
  };

  const name = firstName(user?.fullName);
  const isLoading = docLoading || chatLoading;
  const hasThread = messages.length > 0 || pendingQuestion;

  let body;
  if (isLoading) {
    body = <ThreadSkeleton />;
  } else if (!activeDoc) {
    body = <UploadDropzone onUpload={handleUpload} isUploading={isUploading} progress={uploadProgress} userName={name} />;
  } else if (!hasThread) {
    body = <Welcome userName={name} documentName={activeDoc.fileName} onPick={askQuestion} disabled={isAsking} />;
  } else {
    body = (
      <div className="space-y-10 py-6">
        {messages.map((m, i) => (
          <MessagePair
            key={m.id}
            message={m}
            userName={user?.fullName}
            showDay={i === 0 || dayLabel(m.createdAt) !== dayLabel(messages[i - 1].createdAt)}
          />
        ))}
        {pendingQuestion && (
          <div className="space-y-6">
            <UserBubble text={pendingQuestion} userName={user?.fullName} />
            <TypingIndicator />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-canvas">
      <Sidebar
        user={user}
        document={activeDoc}
        docLoading={docLoading}
        isUploading={isUploading}
        messages={messages}
        onUpload={handleUpload}
        onDeleteClick={() => {
          setDrawerOpen(false);
          setIsDeleteOpen(true);
        }}
        onSelectMessage={handleSelectMessage}
        onSignOut={handleSignOut}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col bg-canvas lg:my-2 lg:mr-2 lg:rounded-[28px] lg:border lg:border-line lg:bg-surface/60 lg:shadow-soft">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line/70 px-4 sm:px-6">
          <button onClick={() => setDrawerOpen(true)} className="icon-btn -ml-2 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <LogoMark className="h-7 w-7 rounded-lg" />
            <span className="font-display text-lg font-semibold">Lumen</span>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-2 lg:ml-0">
            {activeDoc ? (
              <span className="flex min-w-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
                <FileText className="h-3.5 w-3.5 shrink-0 text-accent" />
                <span className="hidden shrink-0 sm:inline">Chatting about</span>
                <span className="truncate font-semibold text-ink" title={activeDoc.fileName}>
                  {activeDoc.fileName}
                </span>
              </span>
            ) : (
              !docLoading && (
                <span className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Waiting for a document
                </span>
              )
            )}
          </div>
          <ThemeToggle className="lg:hidden" />
        </header>

        {/* Conversation */}
        <main ref={scrollRef} className="scroll-soft flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">{body}</div>
        </main>

        {/* Composer */}
        {activeDoc && !isLoading && (
          <div className="shrink-0 px-3 pb-3 pt-1 sm:px-6 sm:pb-4">
            <Composer ref={composerRef} onSend={askQuestion} disabled={!activeDoc} isAsking={isAsking} />
          </div>
        )}
      </div>

      <DeleteDialog
        isOpen={isDeleteOpen}
        fileName={activeDoc?.fileName || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
