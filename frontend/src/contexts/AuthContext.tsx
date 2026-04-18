import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedRole = localStorage.getItem('user_role');
    
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
    
    setIsInitialized(true);
  }, []);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    setToken(null);
    setRole(null);
  };

  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
