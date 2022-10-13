import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";

function AccountRoutes() {
  return (
    <Routes>
      <Route path={"login"} element={<Login />} />
      <Route path={"profile"} element={<Profile />} />
    </Routes>
  );
}

export default AccountRoutes;
