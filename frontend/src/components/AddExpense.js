import React, { useState, useRef, useEffect } from 'react';
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
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef(null);

  const categorySuggestions = ['Food', 'Travel', 'Groceries', 'Rent', 'Medical', 'Utilities'];

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  };

  const handleSuggestionClick = (value) => {
    setForm({ ...form, category: value });
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
        'https://expense-tracker-mvx1.onrender.com/api/expenses',
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
      setSubmitted(true);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">➕ Add Expense</h2>

      {message && (
        <div
          className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="e.g., Grocery"
            value={form.title}
            onChange={handleChange}
            ref={titleRef}
            required
          />
          {form.title && <span className="badge bg-primary mt-1">📝 {form.title}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Amount (₹)</label>
          <input
            name="amount"
            type="number"
            className="form-control"
            placeholder="e.g., 500"
            value={form.amount}
            onChange={handleChange}
            required
          />
          {form.amount && <span className="badge bg-warning mt-1">₹{form.amount}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Category</label>
          <input
            name="category"
            className="form-control"
            placeholder="e.g., Food, Rent, Travel"
            value={form.category}
            onChange={handleChange}
            required
          />
          <div className="mt-2">
            {categorySuggestions.map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm me-2 mb-2 ${form.category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handleSuggestionClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Date</label>
          <input
            name="date"
            type="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className={`btn ${submitted ? 'btn-success' : 'btn-primary'} btn-lg`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : submitted ? '✅ Submitted' : '➕ Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
