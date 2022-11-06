import React, { useState } from "react";
import Axios from "axios";
import { API_HOST } from "Constants";
import { axiosInstance } from "utils/useFetch";
//csrf token
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function App() {
  const [accountInfo, setAccountInfo] = useState({});

  const handleChage = (e) => {
    setAccountInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginClick = async (e) => {
    try {
      const response = await Axios({
        method: "POST",
        url: API_HOST + "/accounts/login/",
        data: accountInfo,
        withCredentials: true, //이게 있어야 쿠키로 jwt나 csrf 토큰 정보를 받을수있음. //
        //frontend와 backend의 주소가 다를경우.... credentials를 제외하고면 cors 허락만 있으면 서버로 요청하고 결과를 받을수있다.
        //하지만 credential이라고하는것은 쿠키와 관계된다. 서버에서 정한 쿠키를 받거나. 로컬에 있는 쿠키를 서버로 전달하기위해서는 creadential 설정이 뒤따라야함.
        // frontend에서는 fetch의 경우. credential: inlcude를 주거나 axios를 이용하면 withCredentials:true를 주거나 해야함. 그리고 backend에서는 cors관련하여  CORS_ALLOW_CREDENTIALS를 True를 설정해야
        // front와 back이 쿠키를 주고 받을수 있다.  (Cross-Origin Resource Sharing (CORS))
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        // back와 front가 다를 경우 front에서 넘기는 csrt토큰을 서버가 인정해주기 위해서는 back에서 setting에서 CSRF_TRUSTED_ORIGINS에 backend의 도메인을 등록해줘야함.
      });

      window.localStorage.setItem(
        "refresh",
        JSON.stringify(response.data.refresh)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefreshClick = async () => {
    console.log({
      refresh: JSON.parse(window.localStorage.getItem("refresh")),
    });
    const response2 = await axiosInstance({
      method: "POST",
      url: API_HOST + "/accounts/refresh/",
      data: { refresh: JSON.parse(window.localStorage.getItem("refresh")) },
    });
    window.localStorage.setItem(
      "refresh",
      JSON.stringify(response2.data.refresh)
    );
  };

  const handleFindClick = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: API_HOST + "/api/posts/",
      });

      console.log("메인: ", response.data);
    } catch (err) {
      console.log("메인 에러", err);
    }
  };

  return (
    <div>
      {JSON.stringify(accountInfo)}
      <p>Hello World.</p>
      <p>
        ID : <input type="text" name="username" onChange={handleChage} />
      </p>
      <p>
        PW : <input type="password" name="password" onChange={handleChage} />
      </p>
      <input type="button" value="Login" onClick={handleLoginClick} />
      <hr />
      <input type="button" value="조회" onClick={handleFindClick} />
      <hr />
      <input type="button" value="Refresh" onClick={handleRefreshClick} />
    </div>
  );
}
