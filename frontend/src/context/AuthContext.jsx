import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");


  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // ✅ triggers rerender
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null); // ✅ triggers rerender
  };

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
