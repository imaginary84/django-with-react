import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "appStore";

export default function LoginRequiredRoute(props) {
  const location = useLocation();

  const { children } = props;

  const {
    store: { isAuthenticated },
  } = useAppContext();

  if (isAuthenticated) {
    console.log("로그인 상태");
  } else {
    console.log("로그아웃상태");
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={"/accounts/login/"} state={{ from: location.pathname }} />
  );
}
