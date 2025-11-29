// src/components/RoleProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RoleProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole: "admin" | "client" }> = ({ children, requiredRole }) => {
  const { currentUser, loading, profile } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000); // 5s fallback
    return () => clearTimeout(t);
  }, []);

  // Avoid showing blocking loading UI; render nothing while auth/profile loads.
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  // If there's no profile yet, allow client routes to render (most users are clients by default)
  // but keep stricter handling for admin routes.
  if (!profile) {
    if (requiredRole === "client") {
      return <>{children}</>;
    }

    // For admin-required routes, wait up to the timeout for a profile; otherwise redirect to dashboard.
    if (!timedOut) return null;
    return <Navigate to="/dashboard" replace />;
  }

  if (profile.role !== requiredRole) {
    // If the user's role doesn't match, redirect them to their dashboard instead of forcing admin.
    if (profile.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};
