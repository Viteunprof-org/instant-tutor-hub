import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, userType: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, userType: 'student' | 'teacher', parentType?: 'student' | 'parent') => Promise<void>;
  isLoading: boolean;
  isFirstLogin: boolean;
  setIsFirstLogin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const savedUser = localStorage.getItem('vup-user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Don't trigger onboarding on app load - only after registration
      setIsFirstLogin(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'student' | 'teacher') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName: userType === 'student' ? 'Élève' : 'Professeur',
      lastName: 'Test',
      type: userType,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
    };
    
    setUser(mockUser);
    localStorage.setItem('vup-user', JSON.stringify(mockUser));
    
    // Login should not trigger onboarding - only registration does
    setIsFirstLogin(false);
    
    setIsLoading(false);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, userType: 'student' | 'teacher', parentType?: 'student' | 'parent') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      firstName,
      lastName,
      type: userType,
      parentType,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date(),
    };
    
    setUser(mockUser);
    localStorage.setItem('vup-user', JSON.stringify(mockUser));
    
    // After registration, user should see onboarding
    setIsFirstLogin(true);
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsFirstLogin(false);
    localStorage.removeItem('vup-user');
    localStorage.removeItem('vup-onboarding-seen');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, isLoading, isFirstLogin, setIsFirstLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}