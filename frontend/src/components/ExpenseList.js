import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getToken, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const navigate = useNavigate();

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get('https://expense-tracker-mvx1.onrender.com/api/expenses', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenses(res.data);
    } catch (err) {
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
      await axios.delete(`https://expense-tracker-mvx1.onrender.com/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      setError('❌ Failed to delete expense');
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
      const res = await axios.put(`https://expense-tracker-mvx1.onrender.com/api/expenses/${id}`, editForm, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      setExpenses(prev => prev.map(exp => exp._id === id ? res.data : exp));
      setEditingId(null);
    } catch {
      setError('❌ Failed to update expense');
    }
  };

  // Filtered & searched expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase()) ||
                          exp.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(expenses.map(exp => exp.category))];

  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyData = filteredExpenses.reduce((acc, exp) => {
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

  const isToday = (date) => {
    const today = new Date().toDateString();
    return new Date(date).toDateString() === today;
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">💰 Expense List</h2>
      <h5 className="mb-3 text-primary">🧾 Total: ₹{total.toLocaleString()}</h5>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="🔍 Search title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="alert alert-info">No matching expenses found.</div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(exp => (
                  <React.Fragment key={exp._id}>
                    <tr className={isToday(exp.date) ? 'table-success' : ''}>
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

          <h4 className="mb-3">📊 Monthly Chart</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
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
