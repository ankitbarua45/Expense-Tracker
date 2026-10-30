import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTransactions } from '../context/TransactionContext';
import { format, parseISO, getQuarter, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const BudgetCharts = () => {
  const { transactions } = useTransactions();
  const [timePeriod, setTimePeriod] = useState('quarterly');
  const [yearFilter, setYearFilter] = useState('all');

  // Get available years from transactions
  const availableYears = React.useMemo(() => {
    const years = new Set();
    transactions.forEach(tx => {
      try {
        const txDate = parseISO(tx.date);
        if (!isNaN(txDate.getTime())) {
          years.add(txDate.getFullYear());
        }
      } catch {
        // Skip invalid dates
      }
    });
    return Array.from(years).sort().reverse();
  }, [transactions]);

  // Filter transactions by year if selected
  const filteredTransactions = React.useMemo(() => {
    if (yearFilter === 'all') return transactions;
    return transactions.filter(tx => {
      try {
        const txDate = parseISO(tx.date);
        return !isNaN(txDate.getTime()) && txDate.getFullYear() === parseInt(yearFilter);
      } catch {
        return false;
      }
    });
  }, [transactions, yearFilter]);

  // Group data based on time period
  const groupedData = React.useMemo(() => {
    const acc = {};
    
    filteredTransactions.forEach(tx => {
      let txDate;
      try {
        txDate = parseISO(tx.date);
        if (isNaN(txDate.getTime())) throw new Error("Invalid date");
      } catch {
        txDate = new Date();
      }

      let key, timestamp;
      
      if (timePeriod === 'monthly') {
        key = format(txDate, 'MMM yy');
        timestamp = txDate.getTime();
      } else if (timePeriod === 'quarterly') {
        const quarter = getQuarter(txDate);
        key = `Q${quarter} '${format(txDate, 'yy')}`;
        timestamp = startOfQuarter(txDate).getTime();
      } else {
        key = format(txDate, 'yyyy');
        timestamp = startOfYear(txDate).getTime();
      }

      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0, timestamp };
      }

      if (tx.type === 'income') {
        acc[key].income += tx.amount;
      } else {
        acc[key].expense += tx.amount;
      }
    });

    return acc;
  }, [filteredTransactions, timePeriod]);

  // Sort by date to ensure chronological order on x-axis
  const sortedPeriods = Object.keys(groupedData).sort((a, b) => groupedData[a].timestamp - groupedData[b].timestamp);

  const labels = sortedPeriods;
  const incomeData = sortedPeriods.map(period => groupedData[period].income);
  const expenseData = sortedPeriods.map(period => groupedData[period].expense);
  const netProfitData = sortedPeriods.map(period => groupedData[period].income - groupedData[period].expense);

  // Calculate totals for summary
  const totalIncome = incomeData.reduce((sum, val) => sum + val, 0);
  const totalExpense = expenseData.reduce((sum, val) => sum + val, 0);
  const totalNetProfit = totalIncome - totalExpense;

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Income',
        data: incomeData,
        backgroundColor: '#10b981', // green
        borderRadius: 4,
        order: 2,
      },
      {
        type: 'bar',
        label: 'Expenses',
        data: expenseData.map(val => -val), // Make expenses negative
        backgroundColor: '#ef4444', // red
        borderRadius: 4,
        order: 2,
      },
      {
        type: 'line',
        label: 'Net Profit',
        data: netProfitData,
        borderColor: '#6366f1', // indigo
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6366f1',
        borderWidth: 2,
        order: 1,
        fill: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend, we'll use custom
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Expenses') {
              return ` ${context.dataset.label}: -$${Math.abs(context.raw).toFixed(2)}`;
            }
            return ` ${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          callback: (value) => {
            if (value >= 1000) {
              return (value >= 0 ? '' : '-') + '$' + (Math.abs(value) / 1000).toFixed(1) + 'K';
            }
            return '$' + value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="card" style={{ height: '100%', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Income and Expenses</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select 
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Years</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
        <div style={{ flex: 1, position: 'relative', height: '350px' }}>
          {transactions.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <p>No transactions to display yet.</p>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  IN
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Income</span>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                ${totalIncome.toFixed(2)}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  EX
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expenses</span>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                ${totalExpense.toFixed(2)}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  NP
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Net Profit</span>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: totalNetProfit >= 0 ? 'var(--success)' : 'var(--danger)', margin: 0 }}>
                {totalNetProfit >= 0 ? '+' : ''}${totalNetProfit.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCharts;
