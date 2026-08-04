import { useState, useCallback } from 'react';
import { documentApi } from '../services/api';

export const useDocument = (onNotify) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch active document metadata
  const fetchDocument = useCallback(async () => {
    setLoading(true);
    try {
      const data = await documentApi.getDocument();
      // Expecting array response [ {...} ] or empty array []
      if (Array.isArray(data) && data.length > 0) {
        setDocument(data[0]);
      } else {
        setDocument(null);
      }
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  // Handle PDF file upload
  const uploadDocument = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      onNotify?.('Please select a valid PDF file.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await documentApi.uploadDocument(file);
      onNotify?.(res.message || 'Document uploaded successfully', 'success');
      await fetchDocument();
      return true;
    } catch (err) {
      onNotify?.(err.message, 'error');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Document Deletion
  const deleteDocument = async (id) => {
    setLoading(true);
    try {
      const res = await documentApi.deleteDocument(id);
      onNotify?.(res.message || 'Document deleted successfully', 'success');
      setDocument(null);
      return true;
    } catch (err) {
      onNotify?.(err.message, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    document,
    loading,
    isUploading,
    fetchDocument,
    uploadDocument,
    deleteDocument,
  };
};