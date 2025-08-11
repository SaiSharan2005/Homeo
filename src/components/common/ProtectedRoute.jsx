import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = '/login',
  requireAuth = true,
}) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to fallback path
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      DOCTOR: '/doctor/home',
      PATIENT: '/patient/home',
      ADMIN: '/admin/home',
      STAFF: '/staff/payments',
    };
    
    const redirectPath = roleRoutes[userRole] || fallbackPath;
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has required role, render children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  fallbackPath: PropTypes.string,
  requireAuth: PropTypes.bool,
};

export default ProtectedRoute; 