import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";
import SignupReact from "./SignupReact";
import SignupAntd from "./SignupAntd";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

function AccountRoutes() {
  return (
    <Routes>
      <Route path={"login"} element={<Login />} />
      <Route
        path={"profile"}
        element={
          <LoginRequiredRoute>
            <Profile />
          </LoginRequiredRoute>
        }
      />
      <Route path={"signup.react"} element={<SignupReact />} />
      <Route path={"signup.antd"} element={<SignupAntd />} />
      <Route path="/*" element={<div>존재하지않는 페이지입니다.</div>} />
    </Routes>
  );
}

export default AccountRoutes;
