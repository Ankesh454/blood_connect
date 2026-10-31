import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    let active = true;
    if (userInfo) {
      try {
        const saved = JSON.parse(userInfo);
        if (saved?.token && saved?._id) {
          setUser(saved);
          API.get('/auth/me').then(({ data }) => {
            if (!active) return;
            const refreshed = { ...data, token: saved.token };
            setUser(refreshed);
            localStorage.setItem('userInfo', JSON.stringify(refreshed));
          }).catch((error) => {
            if (error.response?.status === 401) {
              if (active) setUser(null);
              localStorage.removeItem('userInfo');
              localStorage.removeItem('token');
            }
          }).finally(() => { if (active) setLoading(false); });
          return () => { active = false; };
        }
        else localStorage.removeItem('userInfo');
      } catch {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    return () => { active = false; };
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
