import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/Loginpage" />;
  }

  // If the user is authenticated, render the child component
  return children;
};

export default ProtectedRoute;
