import React, { useState } from 'react';
import axios from 'axios';

function AddExpense() {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ You must be logged in to add expenses');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      amount: parseFloat(form.amount)
    };

    try {
      const res = await axios.post(
        'http://localhost:5000/api/expenses',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Server response:', res.data);

      setMessage('✅ Expense added!');
      setForm({ title: '', amount: '', category: '', date: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">➕ Add Expense</h2>

      {message && (
        <div
          className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="e.g., Grocery"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount (₹)</label>
          <input
            name="amount"
            type="number"
            className="form-control"
            placeholder="e.g., 500"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            name="category"
            className="form-control"
            placeholder="e.g., Food, Rent, Travel"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            name="date"
            type="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : '➕ Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
