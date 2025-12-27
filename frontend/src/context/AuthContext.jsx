import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('access_token');
      if (savedToken) {
        try {
          const response = await authAPI.getCurrentUser(savedToken);
          setUser(response.user);
          setToken(savedToken);
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('access_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  const signup = async (email, password) => {
    const response = await authAPI.signup(email, password);
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      setToken(response.access_token);
      setUser(response.user);
    }
    return response;
  };
  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('access_token', response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };
  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};