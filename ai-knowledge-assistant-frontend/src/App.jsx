import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Workspace from './pages/Workspace';
import FullPageLoader from './components/ui/FullPageLoader';
import { useAuth } from './context/AuthContext';

function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') return <FullPageLoader label="Welcome back — opening your workspace…" />;
  if (status !== 'signed-in') return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function GuestOnly({ children }) {
  const { status } = useAuth();

  if (status === 'checking') return <FullPageLoader />;
  if (status === 'signed-in') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Workspace />
          </RequireAuth>
        }
      />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnly>
            <Signup />
          </GuestOnly>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
