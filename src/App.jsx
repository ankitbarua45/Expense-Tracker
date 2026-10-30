import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TransactionProvider from './context/TransactionContext';
import AuthProvider, { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <TransactionProvider user={user}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </TransactionProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
