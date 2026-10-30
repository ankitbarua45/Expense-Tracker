import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/firebase';
import { User, Mail, LogOut, ArrowLeft, Activity } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Please log in first</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo">
          <Activity size={32} />
          <span>ExpenseTracker</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {user.displayName || 'User Profile'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Manage your account settings
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {user.displayName && (
              <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    Name
                  </span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                  {user.displayName}
                </p>
              </div>
            )}

            <div style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <User size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  User ID
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0, wordBreak: 'break-all' }}>
                {user.uid}
              </p>
            </div>

            <div style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Mail size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Email
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                {user.email}
              </p>
            </div>

            <div style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Activity size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Email Verified
                </span>
              </div>
              <p style={{ 
                color: user.emailVerified ? 'var(--success)' : 'var(--warning)', 
                fontSize: '1rem', 
                margin: 0,
                fontWeight: '500'
              }}>
                {user.emailVerified ? '✓ Verified' : '✗ Not Verified'}
              </p>
            </div>

            <div style={{ 
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <Activity size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Account Created
                </span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="btn btn-danger"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} />
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;