import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isColaborador = localStorage.getItem("isColaborador") === "true";

  if (location.pathname.startsWith("/admin") && !isAdmin) {
    return <Navigate to="/conta" />;
  }

  if (location.pathname.startsWith("/colaborador") && !isColaborador) {
    return <Navigate to="/conta" />;
  }

  return children;
}