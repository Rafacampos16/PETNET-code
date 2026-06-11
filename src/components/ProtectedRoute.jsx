import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSessionExpired, clearSession } from "../utils/authSession";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isColaborador = localStorage.getItem("isColaborador") === "true";
  const isUser = localStorage.getItem("isUser") === "true";

  const isLogged = isAdmin || isColaborador || isUser;

  if (!isLogged || isSessionExpired()) {
    clearSession();

    return (
      <Navigate
        to="/conta"
        replace
        state={{
          from: location.pathname,
          sessionExpired: true,
        }}
      />
    );
  }

  if (location.pathname.startsWith("/admin") && !isAdmin) {
    return <Navigate to="/conta" replace />;
  }

  if (location.pathname.startsWith("/logs") && !isAdmin) {
    return <Navigate to="/conta" replace />;
  }

  if (
    location.pathname.startsWith("/colaborador") &&
    !isAdmin &&
    !isColaborador
  ) {
    return <Navigate to="/conta" replace />;
  }

  return children;
}