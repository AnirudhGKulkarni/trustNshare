// src/components/RoleProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RoleProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole: "admin" | "client" | "super_admin"; allowPending?: boolean; pendingOnly?: boolean }> = ({ children, requiredRole, allowPending = false, pendingOnly = false }) => {
  const { currentUser, loading, profile } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000); // 5s fallback
    return () => clearTimeout(t);
  }, []);

  // Avoid showing blocking loading UI; render nothing while auth/profile loads.
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  const status = profile?.status || "active";

  // If this route is pending-only, block non-pending users
  if (pendingOnly && status !== "pending") {
    // Redirect non-pending users to their dashboard
    if (profile?.role === "super_admin") return <Navigate to="/super-admin" replace />;
    if (profile?.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/client" replace />;
  }

  // Pending users should only access routes explicitly allowed (e.g., WaitingApproval)
  if (status === "pending" && !allowPending && !pendingOnly) {
    return <Navigate to="/waiting-approval" replace />;
  }

  // If there's no profile yet, allow client routes to render (most users are clients by default)
  // but keep stricter handling for admin and super_admin routes.
  if (!profile) {
    // Without a loaded profile, do not allow privileged routes; wait briefly then route to a safe default.
    if (!timedOut) return null;
    return <Navigate to="/client-dashboard" replace />;
  }

  if (profile.role !== requiredRole) {
    // Redirect to user's own dashboard when accessing another role's route.
    if (profile.role === "super_admin") return <Navigate to="/super-admin" replace />;
    if (profile.role === "admin") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};
