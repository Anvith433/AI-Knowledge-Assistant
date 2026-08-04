import { useState, useCallback } from 'react';
import { chatApi } from '../services/api';

export const useChat = (onNotify) => {
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  // Fetch history list
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chatApi.getHistory();
      // Ensure sorted newest first
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setHistory(sorted);
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  // Submit question to backend
  const askQuestion = async (question) => {
    if (!question.trim()) return;

    setIsAsking(true);
    setCurrentAnswer(null);
    try {
      const res = await chatApi.askQuestion(question.trim());
      setCurrentAnswer({
        question: question.trim(),
        answer: res.answer,
      });
      // Refresh chat history after getting answer
      await fetchHistory();
    } catch (err) {
      onNotify?.(err.message, 'error');
    } finally {
      setIsAsking(false);
    }
  };

  const clearCurrentAnswer = () => setCurrentAnswer(null);
  const clearHistoryState = () => {
    setHistory([]);
    setCurrentAnswer(null);
  };

  return {
    currentAnswer,
    history,
    loading,
    isAsking,
    askQuestion,
    fetchHistory,
    clearCurrentAnswer,
    clearHistoryState,
  };
};