// ✅ Get token from localStorage
export const getToken = () => localStorage.getItem('token');

// ✅ Check if token exists
export const isLoggedIn = () => !!getToken();

// ✅ Logout: remove token
export const logout = () => localStorage.removeItem('token');
