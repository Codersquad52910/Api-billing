import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token && storedRole) {
      return { name: localStorage.getItem("userName") || "User" };
    }
    return null;
  });

  const login = (token, userRole, userData = {}) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    if (userData.name) localStorage.setItem("userName", userData.name);

    setRole(userRole);
    setUser({ name: userData.name || "User" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setRole(null);
    setUser(null);
  };

  const updateUser = (userData) => {
    if (userData.name) {
      localStorage.setItem("userName", userData.name);
      setUser(prev => ({ ...prev, name: userData.name }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

