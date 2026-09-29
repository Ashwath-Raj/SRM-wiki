"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  name: string;
  picture?: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  is_srm_student: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginWithGoogleToken: (credential: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loginWithGoogleToken: async () => false,
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem("srmwiki_auth_token");
    const savedUser = localStorage.getItem("srmwiki_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("srmwiki_auth_token");
        localStorage.removeItem("srmwiki_user");
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithGoogleToken = async (credential: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem("srmwiki_auth_token", data.access_token);
        localStorage.setItem("srmwiki_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Google Auth Error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("srmwiki_auth_token");
    localStorage.removeItem("srmwiki_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginWithGoogleToken, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
