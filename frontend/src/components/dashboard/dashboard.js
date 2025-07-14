import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [quote, setQuote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

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

  // ➕ Total expense
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 📅 Monthly grouped data
  const monthlyData = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .sort((a, b) => new Date(`1 ${a[0]}`) - new Date(`1 ${b[0]}`))
    .map(([month, total]) => ({ month, total }));

  const average = chartData.length ? (total / chartData.length).toFixed(2) : 0;

  return (
    <div className="container py-5">
      <h2 className="mb-3">📊 Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm bg-light p-3">
            <h4 className="text-success">💰 Total Expenses</h4>
            <p className="fs-4">₹{total.toLocaleString()}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm bg-light p-3">
            <h4 className="text-info">💡 Smart Insight</h4>
            <p className="fs-5">You spent ₹{average} on average per month.</p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm bg-white p-4 mb-4">
        <h5 className="mb-3">📆 Monthly Expense Chart</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {quote && (
        <div className="card shadow-sm bg-light p-4">
          <h5 className="text-secondary">🧠 Quote of the Day</h5>
          <blockquote className="blockquote mt-2 mb-0">
            <p>"{quote}"</p>
          </blockquote>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
