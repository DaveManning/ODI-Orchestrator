
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SavedReport, BusinessData, DashboardReport } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, name: string, pass: string) => Promise<void>;
  logout: () => void;
  saveReport: (data: BusinessData, report: DashboardReport) => void;
  deleteReport: (reportId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define as a plain function with explicit props to avoid React.FC's child requirement ambiguity
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('insightstream_session');
    if (savedSession) {
      const userData = JSON.parse(localStorage.getItem(`user_${savedSession}`) || 'null');
      if (userData) setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // Simulated auth delay
    await new Promise(r => setTimeout(r, 800));
    const storedUser = localStorage.getItem(`user_${email}`);
    if (!storedUser) throw new Error("User not found");
    
    const userData = JSON.parse(storedUser);
    // In a real app, we'd verify a hash here
    setUser(userData);
    localStorage.setItem('insightstream_session', email);
  };

  const signup = async (email: string, name: string, pass: string) => {
    await new Promise(r => setTimeout(r, 1000));
    if (localStorage.getItem(`user_${email}`)) throw new Error("User already exists");

    const newUser: User = {
      id: email,
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      reportHistory: []
    };

    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    setUser(newUser);
    localStorage.setItem('insightstream_session', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('insightstream_session');
  };

  const saveReport = (data: BusinessData, report: DashboardReport) => {
    if (!user) return;
    
    const newSavedReport: SavedReport = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data,
      report
    };

    const updatedUser = {
      ...user,
      reportHistory: [newSavedReport, ...user.reportHistory]
    };

    setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
  };

  const deleteReport = (reportId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      reportHistory: user.reportHistory.filter(r => r.id !== reportId)
    };
    setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, saveReport, deleteReport, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
