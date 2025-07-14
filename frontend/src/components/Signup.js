import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://expense-tracker-mvx1.onrender.com/api/auth/signup', form, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage('✅ Signup successful!');
      console.log('🪪 JWT Token:', res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || '❌ Signup failed');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
      {/* Centered heading */}
      <h2 className="mb-4 text-center">📝 Signup</h2>

      {/* Signup form card */}
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: '400px' }}>
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="JohnDoe"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
