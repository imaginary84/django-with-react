import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "store";

export default function LoginRequiredRoute(props) {
  const location = useLocation();

  const { children } = props;

  const {
    store: { isAuthenticated },
  } = useAppContext();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={"/accounts/login/"} state={{ from: location.pathname }} />
  );
}
