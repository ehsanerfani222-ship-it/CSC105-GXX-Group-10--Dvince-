import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
