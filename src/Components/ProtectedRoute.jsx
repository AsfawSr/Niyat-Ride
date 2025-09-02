import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // redirect to login
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // redirect if wrong role
  }
  return children; // allowed → render page
};

export default ProtectedRoute;
