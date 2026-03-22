import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (data) => {

    const normalizedRole = data.role.replace("ROLE_", "").toLowerCase();

    const userData = {
      username: data.username,
      role: normalizedRole,
      id: data.id,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.id);
   
 
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
     localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);