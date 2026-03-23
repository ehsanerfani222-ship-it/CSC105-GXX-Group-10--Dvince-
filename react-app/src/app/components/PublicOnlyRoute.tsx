import { Navigate } from 'react-router';
import { isUserLoggedIn } from '../data/appStorage';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  if (isUserLoggedIn()) {
    return <Navigate to="/search" replace />;
  }

  return <>{children}</>;
}