import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, isCashier } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'ADMIN' && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
    if (requiredRole === 'CAJERO' && !isCashier && !isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};
