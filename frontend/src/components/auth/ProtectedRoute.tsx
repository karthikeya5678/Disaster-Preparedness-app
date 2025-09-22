import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If a user is logged in, render the component they are trying to access
  return children;
};

export default ProtectedRoute;