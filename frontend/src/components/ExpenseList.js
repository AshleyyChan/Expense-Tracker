import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  // ✅ Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://expense-tracker-mvx1.onrender.com/api/expenses",
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setExpenses(res.data);
    } catch (err) {
      setError("⚠️ Failed to fetch expenses");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ✅ Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axios.delete(
        `https://expense-tracker-mvx1.onrender.com/api/expenses/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch {
      setError("❌ Failed to delete expense");
    }
  };

  // ✅ Enter edit mode
  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      date: exp.date.slice(0, 10),
    });
  };

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  // ✅ Update expense
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `https://expense-tracker-mvx1.onrender.com/api/expenses/${id}`,
        { ...editForm, amount: Number(editForm.amount) }, // ensure number
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? res.data : exp))
      );
      setEditingId(null);
    } catch {
      setError("❌ Failed to update expense");
    }
  };

  // ✅ Search + filter
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(expenses.map((exp) => exp.category))];
  const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ✅ Monthly chart data
  const monthlyData = filteredExpenses.reduce((acc, exp) => {
    const date = new Date(exp.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`; // sortable key
    acc[key] = (acc[key] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => {
      const [ay, am] = a.split("-").map(Number);
      const [by, bm] = b.split("-").map(Number);
      return ay - by || am - bm;
    })
    .map(([key, total]) => {
      const [year, month] = key.split("-").map(Number);
      const monthName = new Date(year, month).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      return { month: monthName, total };
    });

  const isToday = (date) =>
    new Date(date).toDateString() === new Date().toDateString();

  return (
    <div
      className="container py-5"
      style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#f0f8ff,#e6f7ff)",
      }}
    >
      <h2 className="text-center text-primary mb-3">💰 My Expenses</h2>
      <h5 className="text-center text-success mb-4">
        🧾 Total: ₹{total.toLocaleString()}
      </h5>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* 🔍 Filters */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            className="form-control form-control-lg rounded-pill border-primary shadow-sm"
            placeholder="🔍 Search title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select form-select-lg rounded-pill border-primary shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📝 Expense table */}
      {filteredExpenses.length === 0 ? (
        <div className="alert alert-info text-center">
          No expenses found. Try adding one!
        </div>
      ) : (
        <div className="card glass-card shadow-sm p-3 mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle text-white">
              <thead
                style={{
                  background: "rgba(13,110,253,0.9)",
                  borderRadius: "12px",
                }}
              >
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <React.Fragment key={exp._id}>
                    <tr
                      className={
                        isToday(exp.date)
                          ? "table-success fw-bold animate__animated animate__pulse"
                          : ""
                      }
                    >
                      <td>{exp.title}</td>
                      <td>₹{exp.amount}</td>
                      <td>{exp.category}</td>
                      <td>{new Date(exp.date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm me-1"
                          onClick={() => handleDelete(exp._id)}
                        >
                          🗑️
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(exp)}
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                    {editingId === exp._id && (
                      <tr className="bg-light text-dark">
                        <td>
                          <input
                            className="form-control"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="number"
                            name="amount"
                            value={editForm.amount}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="date"
                            name="date"
                            value={editForm.date}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success btn-sm me-1"
                            onClick={() => handleUpdate(exp._id)}
                          >
                            ✅
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📊 Chart */}
      <div className="card glass-card shadow-sm p-3">
        <h4 className="text-center text-primary mb-3">📊 Monthly Expenses</h4>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="url(#colorUv)" radius={[10, 10, 0, 0]} />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d6efd" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0d6efd" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .glass-card {
          border-radius: 20px;
          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}

export default ExpenseList;
