// src/components/RoleProtectedRoute.tsx
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RoleProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole: "admin" | "client" | "super_admin"; allowPending?: boolean; pendingOnly?: boolean }> = ({ children, requiredRole, allowPending = false, pendingOnly = false }) => {
  const { currentUser, loading, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const lastRedirectRef = useRef<string | null>(null);

  // Determine redirect target based on current auth/profile state. Pure function — no hooks inside.
  const computeRedirect = (cu: any, pr: any): string | null => {
    const status = pr?.status || "active";
    if (!cu) return "/login";
    if (!pr) return "/login";

    if (pendingOnly) {
      if (status === "pending") return null;
      return pr.role === "super_admin" ? "/super-admin" : pr.role === "admin" ? "/dashboard" : "/client";
    }

    if (status === "pending" && !allowPending) return "/waiting-approval";

    if (requiredRole === "admin" && pr.role === "admin") {
      const isActive = pr.status === "active";
      const isPaid = !!pr.paid;
      if (isActive && !isPaid) return "/pricing";
    }

    if (pr.role !== requiredRole) return pr.role === "super_admin" ? "/super-admin" : pr.role === "admin" ? "/dashboard" : "/client";

    return null;
  };

  useEffect(() => {
    if (loading) return;
    // If the auth user exists but the profile is still loading (undefined), wait for profile to resolve
    if (currentUser && profile === undefined) return;

    const target = computeRedirect(currentUser, profile);
    if (!target) return;
    if (location.pathname === target) return;
    if (lastRedirectRef.current === target) return;
    lastRedirectRef.current = target;
    navigate(target, { replace: true });
  }, [loading, currentUser, profile, location.pathname, navigate, requiredRole, allowPending, pendingOnly]);

  // While loading, keep showing nothing. After loading, only render children when user/profile are present and allowed.
  if (loading) return null;
  if (!currentUser) return null;
  if (!profile) return null;

  const finalTarget = computeRedirect(currentUser, profile);
  if (finalTarget && location.pathname !== finalTarget) return null;

  return <>{children}</>;
};
