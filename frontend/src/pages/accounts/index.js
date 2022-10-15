import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";
import Signup from "./Signup";

function AccountRoutes() {
  return (
    <Routes>
      <Route path={"login"} element={<Login />} />
      <Route path={"profile"} element={<Profile />} />
      <Route path={"signup"} element={<Signup />} />
    </Routes>
  );
}

export default AccountRoutes;
