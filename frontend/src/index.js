import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./index.css";
import Root from "pages";
import Axios from "axios";

import { AppProvider } from "appStore";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

const authAxios = Axios.create();

Axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    // if (error.response) {
    //   const { config: originConfig, status } = error.response;

    //   if (status === 401) {
    //     // 엑세스 토큰으로 인증이 거부됨.
    //     try {
    //       const refreshToken = getStorageItem("refresh", "");
    //       const res = await authAxios({
    //         method: "POST",
    //         url: "http://localhost:8000/accounts/token/refresh/",
    //         data: { refresh: refreshToken },
    //       });

    //       const { access, refresh } = res.data;
    //       setStorageItem("access", access);
    //       setStorageItem("refresh", refresh);

    //       originConfig.headers = { Authorization: `Bearer ${access}` };

    //       const res2 = await authAxios(originConfig);
    //       return Promise.resolve(res2);
    //     } catch (error) {
    //       setStorageItem("access", "");
    //       setStorageItem("refresh", "");
    //     }
    //   }
    // }
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
