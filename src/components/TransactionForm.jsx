import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import { PlusCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TransactionForm = () => {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const categories = {
    expense: ['Food', 'Housing', 'Transportation', 'Utilities', 'Entertainment', 'Other'],
    income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    });

    setFormData(prev => ({ ...prev, amount: '', description: '' }));
  };

  return (
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <PlusCircle size={24} style={{ color: 'var(--primary)' }} />
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: categories.expense[0] }))}
              style={{
                flex: 1,
                padding: '1rem',
                border: `2px solid ${formData.type === 'expense' ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                background: formData.type === 'expense' ? 'var(--danger-bg)' : 'rgba(255, 255, 255, 0.03)',
                color: formData.type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'var(--transition)',
                transform: formData.type === 'expense' ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (formData.type !== 'expense') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.type !== 'expense') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <ArrowDownRight size={20} />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: categories.income[0] }))}
              style={{
                flex: 1,
                padding: '1rem',
                border: `2px solid ${formData.type === 'income' ? 'var(--success)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                background: formData.type === 'income' ? 'var(--success-bg)' : 'rgba(255, 255, 255, 0.03)',
                color: formData.type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'var(--transition)',
                transform: formData.type === 'income' ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (formData.type !== 'income') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.type !== 'income') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <ArrowUpRight size={20} />
              Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="date">Date</label>
          <input 
            type="date" 
            id="date" 
            name="date" 
            className="form-control" 
            value={formData.date} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount ($)</label>
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            className="form-control" 
            placeholder="0.00"
            value={formData.amount} 
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <select id="category" name="category" className="form-control" value={formData.category} onChange={handleChange}>
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <input 
            type="text" 
            id="description" 
            name="description" 
            className="form-control" 
            placeholder="What was this for?"
            value={formData.description} 
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ 
            width: '100%', 
            marginTop: '1rem',
            background: formData.type === 'income' ? 'var(--success)' : 'var(--danger)',
            boxShadow: formData.type === 'income' 
              ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' 
              : '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
          }}
        >
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
