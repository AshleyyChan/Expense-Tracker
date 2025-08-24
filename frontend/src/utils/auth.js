// src/utils/auth.js

// ✅ Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// ✅ Check if token exists
export const isLoggedIn = () => !!getToken();

// ✅ Save token (and notify app instantly)
export const saveToken = (token) => {
  localStorage.setItem("token", token);
  // 🔔 Notify listeners (Navbar, ProtectedRoute, etc.)
  window.dispatchEvent(new Event("storage"));
};

// ✅ Logout: remove token (and notify app instantly)
export const logout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage"));
};

