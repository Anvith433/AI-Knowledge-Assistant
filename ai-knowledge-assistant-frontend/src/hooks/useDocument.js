import { useState, useCallback } from 'react';
import { documentApi } from '../services/api';

const MAX_SIZE_MB = 50;

export const useDocument = (onNotify) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch active document metadata
  const fetchDocument = useCallback(async () => {
    setLoading(true);
    try {
      const data = await documentApi.getDocument();
      setDocument(Array.isArray(data) && data.length > 0 ? data[0] : null);
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  // Handle PDF file upload
  const uploadDocument = useCallback(
    async (file) => {
      if (!file) return false;
      const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        onNotify?.("That file isn't a PDF. Please choose a .pdf document.", 'error');
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        onNotify?.(`That file is a bit large. Please keep it under ${MAX_SIZE_MB} MB.`, 'error');
        return false;
      }

      setIsUploading(true);
      setUploadProgress(0);
      try {
        await documentApi.uploadDocument(file, setUploadProgress);
        onNotify?.(`All set! I've read "${file.name}". Ask me anything about it.`, 'success');
        await fetchDocument();
        return true;
      } catch (err) {
        onNotify?.(err.message, 'error');
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [fetchDocument, onNotify]
  );

  // Handle document deletion
  const deleteDocument = useCallback(
    async (id) => {
      setIsDeleting(true);
      try {
        await documentApi.deleteDocument(id);
        onNotify?.('Document removed. You can upload a new one whenever you like.', 'success');
        setDocument(null);
        return true;
      } catch (err) {
        onNotify?.(err.message, 'error');
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [onNotify]
  );

  return {
    document,
    loading,
    isUploading,
    uploadProgress,
    isDeleting,
    fetchDocument,
    uploadDocument,
    deleteDocument,
  };
};
