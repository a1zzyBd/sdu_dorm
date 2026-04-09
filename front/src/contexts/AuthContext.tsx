import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

interface User {
  student_id: string;
  fullname: string;
  email: string;
  birthdate: string;
  specialty: string;
  course: string;  // Changed from number to string to support coordinator values like 'M2'
  room: string | null;
  access: 'student' | 'coordinator';
  violation_count: number;
  account_status: 'active' | 'blocked';
}

interface AuthContextType {
  user: User | null;
  isCoordinator: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // При загрузке проверяем storage (localStorage или sessionStorage)
  useEffect(() => {
    const storedUser = storage.getItem('user');
    const storedToken = storage.getItem('access_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User, _token: string) => {
    setUser(userData);
    // Note: storage.setItem is already called in backendAPI.ts during login
    // _token parameter prefixed with _ to indicate it's intentionally unused
  };

  const logout = () => {
    setUser(null);
    storage.removeItem('user');
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
  };

  const isCoordinator = user?.access === 'coordinator';
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isCoordinator, login, logout, isAuthenticated }}>
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
