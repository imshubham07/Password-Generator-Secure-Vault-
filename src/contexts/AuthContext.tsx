'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authApi, setAuthToken, clearAuthToken, getAuthToken } from '@/utils/api';
import { generateEncryptionKey, createUserSalt } from '@/utils/encryption';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  masterKey: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setMasterKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [masterKey, setMasterKeyState] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await authApi.verify();
      if (response.valid) {
        setUser(response.user);
        // Try to restore master key from sessionStorage
        const savedMasterKey = sessionStorage.getItem('master_key');
        if (savedMasterKey) {
          setMasterKeyState(savedMasterKey);
        }
      } else {
        clearAuthToken();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setAuthToken(response.token);
      setUser(response.user);

      // Generate encryption key from user's password
      const salt = createUserSalt(email);
      const encryptionKey = generateEncryptionKey(password, salt);
      setMasterKeyState(encryptionKey);
      
      // Store master key in sessionStorage (cleared on tab close)
      sessionStorage.setItem('master_key', encryptionKey);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authApi.register(email, password);
      setAuthToken(response.token);
      setUser(response.user);

      // Generate encryption key from user's password
      const salt = createUserSalt(email);
      const encryptionKey = generateEncryptionKey(password, salt);
      setMasterKeyState(encryptionKey);
      
      // Store master key in sessionStorage
      sessionStorage.setItem('master_key', encryptionKey);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setMasterKeyState(null);
    sessionStorage.removeItem('master_key');
  };

  const setMasterKey = (key: string) => {
    setMasterKeyState(key);
    sessionStorage.setItem('master_key', key);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    masterKey,
    login,
    register,
    logout,
    setMasterKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
