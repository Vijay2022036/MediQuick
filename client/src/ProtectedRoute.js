import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';



const ProtectedRoute = ({ allowedRole, fallbackPath }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    toast.error('You are not authorized to access this page. Please log in.');
    return <Navigate to={fallbackPath} replace />;
  }

  if (allowedRole && allowedRole !== role) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
