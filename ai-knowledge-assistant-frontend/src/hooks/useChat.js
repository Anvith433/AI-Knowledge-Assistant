import { useState, useCallback } from 'react';
import { chatApi } from '../services/api';

const byOldestFirst = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

export const useChat = (onNotify) => {
  const [messages, setMessages] = useState([]);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the signed-in user's conversation
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chatApi.getHistory();
      setMessages([...(data || [])].sort(byOldestFirst));
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  // Returns true when the question was answered, so callers can restore the draft on failure
  const askQuestion = useCallback(
    async (question) => {
      const text = question.trim();
      if (!text) return false;

      setPendingQuestion(text);
      try {
        const res = await chatApi.askQuestion(text);
        setMessages((list) => [
          ...list,
          { id: `local-${Date.now()}`, question: text, answer: res.answer, createdAt: new Date().toISOString() },
        ]);
        return true;
      } catch (err) {
        onNotify?.(err.message, 'error');
        return false;
      } finally {
        setPendingQuestion(null);
      }
    },
    [onNotify]
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    pendingQuestion,
    isAsking: pendingQuestion !== null,
    loading,
    askQuestion,
    fetchHistory,
    clearMessages,
  };
};
