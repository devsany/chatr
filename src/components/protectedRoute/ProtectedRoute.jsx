import React, { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import { AppContext } from "../context";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AppContext); // Get the authentication status from context

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? ( // If authenticated, render the component
          <Component {...props} />
        ) : (
          <Navigate to="/login" /> // If not authenticated, redirect to login
        )
      }
    />
  );
};

export default ProtectedRoute;
