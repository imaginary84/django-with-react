import React, { useEffect, useState } from "react";
import Axios from "axios";
import Post from "./Post";

const apiUrl = "http://localhost:8000/api/posts/";

function PostList() {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    console.log("Mounted");
    // debugger;

    Axios.get(apiUrl)
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
