import React, { createContext, useContext, useEffect, useState } from 'react';
import API from './client';

const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const raw = localStorage.getItem('ims_user');
    if(raw) setUser(JSON.parse(raw));
  },[]);

  const login = async (email, password)=>{
    const res = await API.post('/auth/login', {email, password});
    localStorage.setItem('ims_token', res.data.token);
    localStorage.setItem('ims_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }
  const logout = ()=>{
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
    setUser(null);
  }
  return React.createElement(AuthContext.Provider, { value: { user, login, logout } }, children);
}

export function useAuth(){
  return useContext(AuthContext);
}
