import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTransactions, addTransaction as addTx, deleteTransaction as delTx } from '../services/firebase';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

const TransactionProvider = ({ user, children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTransactions(user.uid);
        // Sort by date descending
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [user]);

  const addTransaction = async (transaction) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const newTx = await addTx(transaction, user.uid);
      setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      await delTx(id, user.uid);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, deleteTransaction, user }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
