import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./index.css";
import Root from "pages";
import App from "App";
import Axios from "axios";

import { AppProvider } from "appStore";

Axios.interceptors.request.use(
  (request) => {
    // Edit request config
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppProvider>
      <Root />
      {/* <App /> */}
    </AppProvider>
  </BrowserRouter>
);
