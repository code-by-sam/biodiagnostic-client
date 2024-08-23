import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const userRole = localStorage.getItem("userRole"); // Asume que el rol del usuario está en el localStorage

  if (!allowedRoles.includes(userRole)) {
    // Redirige a la página de acceso no autorizado si el rol no está permitido
    return <Navigate to="/unauthorized" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
