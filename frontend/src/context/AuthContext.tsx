import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  userName: string;
  userEmail: string;
  userId: string | null;
  login: (token: string, name: string, email: string, userId: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userName, setUserName] = useState<string>(localStorage.getItem("userName") || "Felhasználó");
  const [userEmail, setUserEmail] = useState<string>(localStorage.getItem("userEmail") || "");
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));

  const login = (newToken: string, name: string, email: string, newUserId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserName(name);
    setUserEmail(email);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    setToken(null);
    setUserName("");
    setUserEmail("");
    setUserId(null);
  };

  const updateProfile = (name: string, email: string) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setUserName(name);
    setUserEmail(email);
  };

  return (
    <AuthContext.Provider value={{ token, userName, userEmail, userId, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("A useAuth hook csak az AuthProvider-en belül használható!");
  }
  return context;
};