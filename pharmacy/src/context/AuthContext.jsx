import { createContext, useContext, useEffect, useState } from 'react';
import { auth as authApi } from '../api/pharmacyApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pharmacy_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('pharmacy_token', token);
    else localStorage.removeItem('pharmacy_token');
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.token) setToken(res.token);
    return res;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    if (res?.token) setToken(res.token);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
