import React from 'react';
import { Download } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

const ExportPanel = () => {
  const { transactions } = useTransactions();

  const exportCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => [
        format(new Date(tx.date), 'yyyy-MM-dd'),
        tx.type,
        tx.category,
        `"${tx.description || ''}"`, // handle commas in desc
        tx.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    if (transactions.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Expense Tracker Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 32);

    let y = 45;
    
    // Add Summary
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, y);
    y += 8;
    doc.text(`Total Expense: $${totalExpense.toFixed(2)}`, 14, y);
    y += 8;
    doc.text(`Net Balance: $${balance.toFixed(2)}`, 14, y);
    y += 15;

    // Add Transactions header
    doc.setFontSize(14);
    doc.text('Recent Transactions', 14, y);
    y += 10;
    
    doc.setFontSize(10);
    transactions.slice(0, 50).forEach(tx => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const dateStr = format(new Date(tx.date), 'MMM dd, yyyy');
      const sign = tx.type === 'income' ? '+' : '-';
      doc.text(`${dateStr} | ${tx.category} | ${tx.description || 'N/A'} | ${sign}$${tx.amount.toFixed(2)}`, 14, y);
      y += 7;
    });

    doc.save(`report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Download size={24} style={{ color: 'var(--primary)' }} />
        Export Data
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Download your financial data for offline tracking or accounting.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={exportCSV} 
          className="btn btn-outline" 
          style={{ flex: 1 }}
          disabled={transactions.length === 0}
        >
          Export CSV
        </button>
        <button 
          onClick={exportPDF} 
          className="btn btn-outline" 
          style={{ flex: 1 }}
          disabled={transactions.length === 0}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
