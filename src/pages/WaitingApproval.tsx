import React from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Mail, ArrowLeft, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const WaitingApproval: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-6 text-gray-100">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-50 inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm hover:bg-gray-800 hover:border-blue-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <Card className="w-full max-w-lg shadow-elevated bg-gray-900 text-gray-100 border border-gray-800">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="text-lg font-semibold">trustNshare</div>
          </div>

          <div className="pt-2">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 border-2 border-orange-500/50">
              <Clock className="h-10 w-10 text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold mt-4">Account Pending Approval</CardTitle>
            <CardDescription className="text-base mt-2">
              Your account has been created successfully and is currently awaiting approval from our super admin team.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-blue-800/50 bg-blue-950/30 p-4 space-y-2">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-200">
                  <strong>What happens next?</strong>
                </p>
                <ul className="mt-2 text-sm text-blue-200 space-y-1 list-disc list-inside">
                  <li>Our super admin will review your account</li>
                  <li>You will receive an email once approved</li>
                  <li>After approval, you can log in and access all features</li>
                </ul>
              </div>
            </div>
          </div>

          {currentUser?.email && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Signed in as: <span className="text-gray-100 font-medium">{currentUser.email}</span></p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              aria-label="Sign out"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/30 border-0 py-3 rounded-md transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </span>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Need help? Contact our support team
            </p>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-center text-sm text-gray-400">
              trustNshare helps teams and individuals store, share, and control access to important documents with end-to-end security and audit trails.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingApproval;
