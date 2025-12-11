import React from "react";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    profile?.name ||
    (profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : undefined) ||
    currentUser?.displayName ||
    "User";

  const email = profile?.email || currentUser?.email || "";

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const prettyRole = (r?: string) => {
    if (!r) return "User";
    if (r === "super_admin") return "Super Admin";
    if (r === "admin") return "Admin";
    if (r === "client") return "Client";
    return r.charAt(0).toUpperCase() + r.slice(1);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {profile && ["super_admin", "admin", "client"].includes(profile.role) ? (
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground">trustNshare</h1>
            <span className="text-sm text-muted-foreground">{prettyRole(profile.role)}</span>
          </div>
        ) : (
          <>
            <div className="h-8 w-8 rounded-md overflow-hidden">
              <img src="/trustNshare.jpg" alt="trustNshare" className="w-8 h-8 object-cover block dark:hidden" />
              <img src="/bg.png" alt="trustNshare dark" className="w-8 h-8 object-cover hidden dark:block" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">trustNshare</h1>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <button className="px-3 py-1 rounded-md bg-blue-700 text-white text-sm font-medium hover:opacity-95">Connect to Hardware</button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="hidden md:block text-sm font-medium">{prettyRole(profile?.role)}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">{email}</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/settings") }>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
