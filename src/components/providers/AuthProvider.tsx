"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiRequest } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/onboarding"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch the current user from the API using the saved token
  useEffect(() => {
    const token = localStorage.getItem("postflow-token");
    const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    if (!token) {
      Promise.resolve().then(() => {
        setIsLoading(false);
        if (!isPublic) {
          router.push("/sign-in");
        }
      });
      return;
    }

    apiRequest<{ user: User }>("/api/auth/me")
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("postflow-token");
        if (!isPublic) {
          router.push("/sign-in");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname, router]);

  const logout = useCallback(() => {
    localStorage.removeItem("postflow-token");
    setUser(null);
    router.push("/sign-in");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
