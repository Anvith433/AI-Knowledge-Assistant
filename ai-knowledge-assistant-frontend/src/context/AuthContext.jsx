import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, onUnauthorized, tokenStore } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const notify = useToast();
  const [user, setUser] = useState(null);
  // "checking" while we validate a stored token on first load
  const [status, setStatus] = useState(() => (tokenStore.get() ? 'checking' : 'signed-out'));

  const signOut = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('signed-out');
  }, []);

  // Any 401 from the API means our session is no longer valid
  useEffect(() => {
    onUnauthorized(signOut);
    return () => onUnauthorized(null);
  }, [signOut]);

  useEffect(() => {
    if (status !== 'checking') return;
    let cancelled = false;
    authApi
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('signed-in');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) {
          signOut();
        } else {
          // Server unreachable: keep the saved session so a reload can restore it
          setStatus('signed-out');
          notify(err.message, 'error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [status, signOut, notify]);

  const handleAuthResponse = useCallback((res) => {
    tokenStore.set(res.token);
    setUser(res.user);
    setStatus('signed-in');
    return res.user;
  }, []);

  const signIn = useCallback(
    (email, password) => authApi.login(email.trim(), password).then(handleAuthResponse),
    [handleAuthResponse]
  );

  const signUp = useCallback(
    (fullName, email, password) => authApi.signup(fullName.trim(), email.trim(), password).then(handleAuthResponse),
    [handleAuthResponse]
  );

  const value = useMemo(() => ({ user, status, signIn, signUp, signOut }), [user, status, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
