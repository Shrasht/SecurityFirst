import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // If user is not authenticated, redirect to login page
  // Otherwise, render the protected component
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
