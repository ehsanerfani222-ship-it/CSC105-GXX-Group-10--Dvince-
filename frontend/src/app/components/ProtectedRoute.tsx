import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";


interface ProtectedRouteProps {
  children: ReactNode;
}


export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();

  // ✅ 1. Wait until auth state is initialized
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // ✅ 2. If no token → redirect
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ 3. If authenticated → allow access
  return children;
}