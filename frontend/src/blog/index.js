import { Route, Routes } from "react-router-dom";
// import AppLayout from "components/AppLayout";
import LoginRequiredRoute from "utils/LoginRequiredRoute";
import { BlogNew } from "./BlogNew";
import { BlogList } from "./BlogList";
import { BlogDetail } from "./BlogDetail";

function BlogHome() {
  return (
    <>
      <h1>Blog</h1>
      <Routes>
        <Route
          path=""
          element={
            <LoginRequiredRoute>
              <BlogList />
            </LoginRequiredRoute>
          }
        ></Route>
        <Route path="new" element={<BlogNew />} />
        <Route path="detail/:pk" element={<BlogDetail />} />
      </Routes>
    </>
  );
}

export default BlogHome;
