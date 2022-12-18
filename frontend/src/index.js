import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./index.css";
import Root from "pages";
import App from "App";
import App2 from "App2";
// import App3 from "App3";
import { TagForm } from "components/TagForm";

import { AppProvider } from "appStore";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppProvider>
      <Root />
      {/* <TagForm /> */}
    </AppProvider>
  </BrowserRouter>
);
