"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { fetchCurrentUser, logoutUser } from "./api";
import { GitHubUser } from "./types";

interface AuthContextValue {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "repo,read:user";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
