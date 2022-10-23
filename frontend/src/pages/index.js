import React from "react";
import { Route, Routes } from "react-router-dom";
// import AppLayout from "components/AppLayout";
import About from "./About";
import Home from "./Home";
import AccountRoutes from "./accounts";
import LoginRequiredRoute from "utils/LoginRequiredRoute";
import PostNew from "./PostNew";

function Root() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginRequiredRoute>
            <Home />
          </LoginRequiredRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/accounts/*" element={<AccountRoutes />} />
      <Route
        path={"posts/new"}
        element={
          <LoginRequiredRoute>
            <PostNew />
          </LoginRequiredRoute>
        }
      />
      <Route path="/*" element={<div>존재하지않는 페이지입니다.</div>} />
    </Routes>
  );
}

export default Root;
