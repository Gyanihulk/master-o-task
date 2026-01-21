import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../utils/normalize";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "ADMIN" | "EMPLOYEE";
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = normalizeRole(user.role);
  if (role && normalizedRole !== role) {
    return (
      <Navigate
        to={normalizedRole === "ADMIN" ? "/admin" : "/employee"}
        replace
      />
    );
  }

  return <>{children}</>;
};
