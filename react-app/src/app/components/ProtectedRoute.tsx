import { Navigate } from 'react-router';
import { isUserLoggedIn } from '../data/appStorage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isUserLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}