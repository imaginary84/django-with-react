import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "appStore";

export default function LoginRequiredRoute({ children }) {
  const location = useLocation();

  const {
    store: { isAuthenticated },
  } = useAppContext();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={"/accounts/login/"} state={{ from: location.pathname }} />
  );
}
