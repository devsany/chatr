import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext); // Get authentication status

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
