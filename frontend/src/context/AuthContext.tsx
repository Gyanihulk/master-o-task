import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { AuthResponseDto } from "../dto/auth.dto";
import type { AuthUser } from "../interfaces/AuthUser";
import { setAuthToken } from "../api/client";
import { normalizeRole } from "../utils/normalize";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (data: AuthResponseDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedToken && storedUser) {
      const parsed = JSON.parse(storedUser) as AuthUser;
      setToken(storedToken);
      setUser({ ...parsed, role: normalizeRole(parsed.role) });
    }
  }, []);

  const login = (data: AuthResponseDto) => {
    const normalizedUser = { ...data.user, role: normalizeRole(data.user.role) };
    setToken(data.token);
    setUser(normalizedUser);
    setAuthToken(data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ user, token, login, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
