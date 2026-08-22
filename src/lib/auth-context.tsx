"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState } from "@/lib/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    organization?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "transformai_auth";
const USERS_KEY = "transformai_users";

function getUsers(): Record<string, { user: User; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { user: User; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(password: string): string {
  // Simple hash for demo - NOT production secure
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const user = JSON.parse(saved) as User;
        setState({ user, isLoading: false, isAuthenticated: true });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const users = getUsers();
    const record = users[email.toLowerCase()];

    if (!record) {
      return { success: false, error: "No account found with this email address." };
    }

    if (record.password !== hashPassword(password)) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
    setState({ user: record.user, isLoading: false, isAuthenticated: true });
    return { success: true };
  }, []);

  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      organization?: string;
    }) => {
      await new Promise((r) => setTimeout(r, 800));

      const users = getUsers();
      if (users[data.email.toLowerCase()]) {
        return { success: false, error: "An account with this email already exists." };
      }

      const user: User = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        email: data.email.toLowerCase(),
        name: data.name,
        organization: data.organization,
        createdAt: new Date().toISOString(),
      };

      users[data.email.toLowerCase()] = {
        user,
        password: hashPassword(data.password),
      };
      saveUsers(users);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isLoading: false, isAuthenticated: true });
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const users = getUsers();
    if (!users[email.toLowerCase()]) {
      return { success: false, error: "No account found with this email address." };
    }
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
