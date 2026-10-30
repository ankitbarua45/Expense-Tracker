import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import { logoutUser } from '../services/firebase';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, LogOut, User } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetCharts from './BudgetCharts';
import ExportPanel from './ExportPanel';

const Dashboard = () => {
  const { transactions, user } = useTransactions();
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

  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo">
          <Activity size={32} />
          <span>ExpenseTracker</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold',
            cursor: 'pointer',
            onClick: () => navigate('/profile')
          }}>
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            cursor: 'pointer',
            onClick: () => navigate('/profile')
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}>
              {user?.displayName || 'User'}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)',
              lineHeight: 1.2
            }}>
              {user?.email}
            </span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-outline danger-hover"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1rem',
              borderColor: 'var(--danger)',
              color: 'var(--danger)'
            }}
          >
            <LogOut size={18} />
            <span>{loading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </header>

      <div className="summary-cards-container">
        <div className="card summary-card">
          <div className="summary-icon balance">
            <Wallet />
          </div>
          <div className="summary-details">
            <h3>Total Balance</h3>
            <p>${balance.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="card summary-card">
          <div className="summary-icon income">
            <ArrowUpRight />
          </div>
          <div className="summary-details">
            <h3>Total Income</h3>
            <p>${totalIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="card summary-card">
          <div className="summary-icon expense">
            <ArrowDownRight />
          </div>
          <div className="summary-details">
            <h3>Total Expense</h3>
            <p>${totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BudgetCharts />
          <TransactionList />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <TransactionForm />
          <ExportPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
