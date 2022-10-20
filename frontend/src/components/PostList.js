import React, { useEffect, useState } from "react";
import Axios from "axios";
import Post from "./Post";
import { useAppContext } from "appStore";
import { Alert } from "antd";

const apiUrl = "http://localhost:8000/api/posts/";

function PostList() {
  const {
    store: {
      jwtToken: { access },
    },
    dispatch,
  } = useAppContext();

  // console.log(store);

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    console.log("Mounted");
    // debugger;
    const headers = { Authorization: `Bearer ${access}` };
    Axios.get(apiUrl, { headers })
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
