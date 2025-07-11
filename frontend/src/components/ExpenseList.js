import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getToken, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  const navigate = useNavigate();

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('⚠️ Failed to fetch expenses');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError(err.response?.data?.message || '❌ Failed to delete expense');
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date.slice(0, 10)
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/expenses/${id}`, editForm, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      setExpenses(prev => prev.map(exp => exp._id === id ? res.data : exp));
      setEditingId(null);
    } catch (err) {
      console.error('❌ Update error:', err);
      setError(err.response?.data?.message || '❌ Failed to update expense');
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyData = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric'
    });
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .sort((a, b) => new Date(`1 ${a[0]}`) - new Date(`1 ${b[0]}`))
    .map(([month, total]) => ({ month, total }));

  return (
    <div className="container py-5">
      <h2 className="mb-4">💰 Expense List</h2>
      <h4 className="mb-4 text-primary">🧾 Total Expenses: ₹{total.toLocaleString()}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {expenses.length === 0 ? (
        <div className="alert alert-info">No expenses found.</div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <React.Fragment key={exp._id}>
                    <tr>
                      <td>{exp.title}</td>
                      <td>₹{exp.amount}</td>
                      <td>{exp.category}</td>
                      <td>{new Date(exp.date).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-danger btn-sm me-1" onClick={() => handleDelete(exp._id)}>🗑️</button>
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(exp)}>✏️</button>
                      </td>
                    </tr>
                    {editingId === exp._id && (
                      <tr>
                        <td><input className="form-control" name="title" value={editForm.title} onChange={handleEditChange} /></td>
                        <td><input className="form-control" type="number" name="amount" value={editForm.amount} onChange={handleEditChange} /></td>
                        <td><input className="form-control" name="category" value={editForm.category} onChange={handleEditChange} /></td>
                        <td><input className="form-control" type="date" name="date" value={editForm.date} onChange={handleEditChange} /></td>
                        <td>
                          <button className="btn btn-success btn-sm me-1" onClick={() => handleUpdate(exp._id)}>✅</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>❌</button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mb-3">📅 Monthly Totals</h4>
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-secondary">
                <tr>
                  <th>Month</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map(({ month, total }) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>₹{total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mb-3">📊 Monthly Spending</h4>
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
        </>
      )}
    </div>
  );
}

export default ExpenseList;