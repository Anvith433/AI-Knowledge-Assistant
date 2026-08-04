import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadDocument from '../components/UploadDocument';
import ChatBox from '../components/ChatBox';
import AnswerCard from '../components/AnswerCard';
import ChatHistory from '../components/ChatHistory';
import DeleteDialog from '../components/DeleteDialog';
import { useDocument } from '../hooks/useDocument';
import { useChat } from '../hooks/useChat';

export default function Home() {
  const [toast, setToast] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Stable toast function (prevents infinite re-render)
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const {
    document,
    loading: docLoading,
    isUploading,
    fetchDocument,
    uploadDocument,
    deleteDocument,
  } = useDocument(showToast);

  const {
    currentAnswer,
    history,
    isAsking,
    askQuestion,
    fetchHistory,
    clearHistoryState,
  } = useChat(showToast);

  // Initial Load
  useEffect(() => {
    fetchDocument();
    fetchHistory();
  }, [fetchDocument, fetchHistory]);

  // Handle document deletion
  const handleConfirmDelete = async () => {
    if (!document) return;

    const success = await deleteDocument(document.id);

    if (success) {
      setIsDeleteOpen(false);
      clearHistoryState();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-900/90 border-red-500 text-red-200'
              : 'bg-emerald-900/90 border-emerald-500 text-emerald-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar hasActiveDocument={!!document} />

      {/* Main Content Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar */}
        <Sidebar
          document={document}
          onDeleteClick={() => setIsDeleteOpen(true)}
          loading={docLoading}
        />

        {/* Main Workspace */}
        <main className="flex-1 space-y-6">

          {/* Upload Section */}
          <UploadDocument
            onUpload={uploadDocument}
            disabled={!!document}
            isUploading={isUploading}
          />

          {/* Chat Section */}
          <ChatBox
            onAsk={askQuestion}
            disabled={!document}
            isAsking={isAsking}
          />

          {/* Answer */}
          {currentAnswer && (
            <AnswerCard data={currentAnswer} />
          )}

          {/* History */}
          <ChatHistory history={history} />

        </main>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        fileName={document?.fileName || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isDeleting={docLoading}
      />

    </div>
  );
}