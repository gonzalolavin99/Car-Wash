import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('PrivateRoute: isAuthenticated:', isAuthenticated);
    console.log('PrivateRoute: user:', user);
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    console.log('PrivateRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== 'admin') {
    console.log('PrivateRoute: Not admin, redirecting to home');
    return <Navigate to="/" />;
  }

  console.log('PrivateRoute: Rendering children');
  return <>{children}</>;
};

export default PrivateRoute;