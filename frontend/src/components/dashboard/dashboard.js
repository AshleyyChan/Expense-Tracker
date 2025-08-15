import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchExpenses = async () => {
      try {
        const res = await axios.get('https://expense-tracker-mvx1.onrender.com/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch expenses:', err);
      }
    };

    const fetchQuote = async () => {
      try {
        const res = await axios.get('https://api.quotable.io/random');
        setQuote(res.data.content);
      } catch (err) {
        console.error('❌ Failed to fetch quote:', err);
      }
    };

    fetchExpenses();
    fetchQuote();
  }, [navigate]);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyData = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyData)
    .sort((a, b) => new Date(`1 ${a[0]}`) - new Date(`1 ${b[0]}`))
    .map(([month, total]) => ({ month, total }));
  const average = chartData.length ? (total / chartData.length).toFixed(2) : 0;

  return (
    <div
      className="container py-5"
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #f0f8ff)',
      }}
    >
      <h2 className="mb-4 text-center text-primary">📊 Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card shadow-lg p-4 h-100" style={{ borderRadius: '1rem', background: '#ffffffcc' }}>
            <h4 className="text-success">💰 Total Expenses</h4>
            <p className="fs-3 fw-bold">₹{total.toLocaleString()}</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card shadow-lg p-4 h-100" style={{ borderRadius: '1rem', background: '#ffffffcc' }}>
            <h4 className="text-info">💡 Smart Insight</h4>
            <p className="fs-5">You spent <strong>₹{average}</strong> on average per month.</p>
          </div>
        </div>
      </div>

      <div className="card shadow-lg p-4 mb-4" style={{ borderRadius: '1rem', background: '#ffffffcc' }}>
        <h5 className="mb-3 text-primary">📆 Monthly Expense Chart</h5>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{ borderRadius: '0.5rem', backgroundColor: '#f8f9fa', border: 'none' }}
              />
              <Bar dataKey="total" fill="url(#colorUv)" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {quote && (
        <div
          className="card shadow-lg p-4 text-center"
          style={{
            borderRadius: '1rem',
            background: 'linear-gradient(90deg, #ffe0b2, #fff3e0)',
            fontStyle: 'italic',
          }}
        >
          <h5 className="text-secondary">🧠 Quote of the Day</h5>
          <p className="mt-2 mb-0">"{quote}"</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
