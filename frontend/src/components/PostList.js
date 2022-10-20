import React, { useEffect, useState } from "react";
import Axios from "axios";
import Post from "./Post";
import { setToken, useAppContext } from "appStore";
import { Alert } from "antd";

const apiUrl = "http://localhost:8000/api/posts/";

function PostList() {
  const {
    store: {
      jwtToken: { access, refresh },
    },
    dispatch,
  } = useAppContext();

  // console.log(store);

  const [postList, setPostList] = useState([]);

  const customAios = Axios.create();

  customAios.interceptors.request.use(
    (config) => {
      console.log("Axios.interceptors request success : ", config);
      return config;
    },
    (error) => {
      console.log("Axios.interceptors request error : ", error);
      return Promise.reject(error);
    }
  );

  customAios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("Axios.interceptors response error : ", error);

      const {
        data: { code },
        config: originRequest,
      } = error.response;

      // debugger;
      if (code === "token_not_valid") {
        Axios.post("http://localhost:8000/accounts/token/refresh/", {
          refresh,
        })
          .then((response) => {
            console.log(
              "코튼이 만료되어서 리프레시로 다시 엑스 토큰 발급받음.",
              response
            );
            const { data } = response;
            dispatch(setToken(data));

            // const headers = { Authorization: `Bearer ${data.access}` };
            originRequest.headers = { Authorization: `Bearer ${data.access}` };
            // console.log("원본 요청 : ", config);
            Axios(originRequest).then((response) => {
              console.log("재 요청 결과 : ", response);
              const { data } = response;
              setPostList(data);
            });
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    console.log("Mounted");
    // debugger;
    const headers = { Authorization: `Bearer ${access}` };
    customAios
      .get(apiUrl, { headers })
      .then((response) => {
        console.log("loaded response", response);
        const { data } = response;
        setPostList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {postList.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostList;
