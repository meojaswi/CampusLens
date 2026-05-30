import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.valid) {
        // Token is valid, keep it
      }
    } catch (err) {
      // Token invalid, clear it
      logout();
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name
      });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
