import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  
  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  
  // Optionally, perform additional token validation here:
  // For example, decoding the token and checking expiration

  if (!token) {
    console.log("No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // Token exists, allow rendering the children
  return children;
};

export default PrivateRoute;
