import React from "react";
import Post from "./Post";
import useAuthAxios from "utils/useAuthAxiosAsynAwait";

function PostList() {
  const [postList, loading, error] = useAuthAxios({
    method: "get",
    url: "http://localhost:8000/api/posts/",
    memo: "포스트 리스트 조회",
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error.flag && <div>Error 발생!!!</div>}
      {!error.flag &&
        postList.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
}

export default PostList;
