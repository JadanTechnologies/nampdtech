import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MemberProfile } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  user: MemberProfile | null;
  login: (email: string, role: string) => void;
  logout: () => void;
  register: (data: Partial<MemberProfile>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MemberProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nampd_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, role: string) => {
    // Mock Login Logic
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('nampd_user', JSON.stringify(foundUser));
    } else {
      alert("User not found in mock DB. Try: super@nampd.com, lagos.admin@nampd.com, member@gmail.com");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nampd_user');
  };

  const register = (data: Partial<MemberProfile>) => {
    // Mock Registration
    const newUser: MemberProfile = {
      ...data,
      id: `u${Date.now()}`,
      role: 'MEMBER', // Default registration role
      // Use provided documents or fallback defaults
      documents: data.documents || { ninUrl: '', passportUrl: 'https://picsum.photos/200', businessUrl: '' },
      status: 'PENDING_CHAIRMAN' // Workflow start
    } as MemberProfile;
    
    // In a real app, this would post to API. Here we just set it as current user to simulate "logged in"
    setUser(newUser);
    localStorage.setItem('nampd_user', JSON.stringify(newUser));
    alert("Registration submitted! Please wait for Chairman approval.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};