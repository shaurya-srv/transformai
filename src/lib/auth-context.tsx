"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  avatar?: string;
  createdAt: string;
  provider?: "google" | "credentials";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    organization?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function supabaseUserToUser(supabaseUser: Record<string, unknown>): User {
  const meta = (supabaseUser.user_metadata || {}) as Record<string, string>;
  return {
    id: supabaseUser.id as string,
    email: (supabaseUser.email as string) || "",
    name:
      meta.full_name ||
      meta.name ||
      (supabaseUser.email as string)?.split("@")[0] ||
      "User",
    organization: meta.organization || "",
    avatar: meta.avatar_url || "",
    createdAt: (supabaseUser.created_at as string) || new Date().toISOString(),
    provider:
      ((supabaseUser.app_metadata as Record<string, unknown>)?.provider as
        "google" | "credentials") || "credentials",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Listen for auth state changes
  useEffect(() => {
  let mounted = true;

  const loadSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      if (mounted) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
      return;
    }

    const session = data.session;

    if (session?.user && mounted) {
      const authUser: User = {
        id: session.user.id,
        email: session.user.email ?? "",
        name:
          session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          session.user.email?.split("@")[0] ??
          "User",
        avatar: session.user.user_metadata?.avatar_url,
        createdAt: session.user.created_at,
        provider: "google",
      };

      setState({
        user: authUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } else if (mounted) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  loadSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      const authUser: User = {
        id: session.user.id,
        email: session.user.email ?? "",
        name:
          session.user.user_metadata?.full_name ??
          session.user.user_metadata?.name ??
          session.user.email?.split("@")[0] ??
          "User",
        avatar: session.user.user_metadata?.avatar_url,
        createdAt: session.user.created_at,
        provider:
          (session.user.app_metadata?.provider as "google" | "credentials") ||
          "credentials",
      };

      setState({
        user: authUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist, offer a more helpful message
        if (error.message.includes("Invalid login")) {
          return {
            success: false,
            error: "Invalid email or password. Please try again or create an account.",
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  }, []);

  const signup = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      organization?: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            organization: data.organization || "",
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return {
            success: false,
            error: "An account with this email already exists. Try signing in instead.",
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
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
