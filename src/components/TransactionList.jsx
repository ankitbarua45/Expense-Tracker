import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import { Trash2, ArrowUpRight, ArrowDownRight, Coffee, Home, Car, Zap, Tv, DollarSign, Briefcase, TrendingUp, Gift, HelpCircle } from 'lucide-react';

const categoryIcons = {
  Food: <Coffee size={20} />,
  Housing: <Home size={20} />,
  Transportation: <Car size={20} />,
  Utilities: <Zap size={20} />,
  Entertainment: <Tv size={20} />,
  Salary: <Briefcase size={20} />,
  Freelance: <DollarSign size={20} />,
  Investments: <TrendingUp size={20} />,
  Gift: <Gift size={20} />,
  Other: <HelpCircle size={20} />
};

const TransactionList = () => {
  const { transactions, loading, deleteTransaction } = useTransactions();

  if (loading) {
    return <div className="card"><p style={{ color: 'var(--text-muted)' }}>Loading transactions...</p></div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="card">
        <h2>Recent Transactions</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No transactions found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h2>
      <ul className="transaction-list">
        {transactions.map(tx => (
          <li key={tx.id} className="transaction-item">
            <div className="transaction-info">
              <div className="transaction-category-icon">
                {categoryIcons[tx.category] || <HelpCircle size={20} />}
              </div>
              <div className="transaction-details">
                <h4>{tx.description || tx.category}</h4>
                <p>{tx.category} • {format(new Date(tx.date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            
            <div className="transaction-amount-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className={`transaction-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </div>
              <button onClick={() => deleteTransaction(tx.id)} className="btn-icon" aria-label="Delete transaction" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
