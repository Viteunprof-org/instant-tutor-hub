/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import apiService, { RegisterStudentRequest } from "@/services/api";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, userType: "student" | "teacher") => Promise<void>;
  logout: () => void;
  register: (user: any) => Promise<void>;
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
    const initializeAuth = async () => {
      const token = localStorage.getItem("vup-token");
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token invalide, le supprimer
            localStorage.removeItem("vup-token");
            localStorage.removeItem("vup-user");
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
          localStorage.removeItem("vup-token");
          localStorage.removeItem("vup-user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, userType: "student" | "teacher" | "professional") => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      console.log("Login response:", response);
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = {
          ...response.data,
          //avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        // Vérifier que le type d'utilisateur correspond
        if (userData.type !== userType) {
          throw new Error(`Type d'utilisateur incorrect. Attendu: ${userType}, reçu: ${userData.type}`);
        }

        // Stocker le token et les données utilisateur
        localStorage.setItem("vup-token", token);
        localStorage.setItem("vup-user", JSON.stringify(userData));

        setUser(userData);
        setIsFirstLogin(false);
      } else {
        throw new Error(response.message || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (user: any) => {
    setIsLoading(true);
    try {
      console.log("Registering user:", user);

      // TODO Rename this to Register beacause :
      // it can be used for both students and teachers
      const response = await apiService.registerStudent(user);

      if (response.success && response.data) {
        const { email, type } = response.data;
        console.log("Registration response:", response);
        await login(email, user.password, type);
      } else {
        throw new Error(response.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user:", user?.email);
      // await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsFirstLogin(false);
      localStorage.removeItem("vup-token");
      localStorage.removeItem("vup-user");
      localStorage.removeItem("vup-onboarding-seen");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        isLoading,
        isFirstLogin,
        setIsFirstLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
