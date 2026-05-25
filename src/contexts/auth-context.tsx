import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load auth state from localStorage on mount (client-side only)
    if (typeof window === "undefined") return;

    const savedUser = localStorage.getItem("aegis_user");
    const savedToken = localStorage.getItem("aegis_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error("Failed to parse saved user data:", error);
        localStorage.removeItem("aegis_user");
        localStorage.removeItem("aegis_token");
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem("aegis_user", JSON.stringify(user));
      localStorage.setItem("aegis_token", token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("aegis_user");
      localStorage.removeItem("aegis_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
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
