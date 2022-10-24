import React, { useEffect } from "react";
import Post from "./Post";
import useAuthAxios from "utils/useAuthAxiosAsynAwait";
import { useNavigate } from "react-router-dom";

function PostList() {
  const navigate = useNavigate();
  const [postList, loading, error, refetch] = useAuthAxios({
    method: "get",
    url: "http://localhost:8000/api/posts/",
    memo: "포스트 리스트 조회",
  });

  const [, , likeError, like] = useAuthAxios({
    method: "post",
    memo: "like 처리",
  });

  const [, , unlikeError, unlike] = useAuthAxios({
    method: "delete",
    memo: "unlike 처리",
  });

  const handleLike = async ({ post, is_like }) => {
    // console.log(post, is_like);
    if (is_like) {
      await like(null, `http://localhost:8000/api/posts/${post.id}/like/`);

      // navigate("/");
      // refetch();
    } else {
      await unlike(null, `http://localhost:8000/api/posts/${post.id}/like/`);

      navigate("/");
    }
  };

  // useEffect(() => {
  //   console.log(likeError, unlikeError);
  //   // debugger;
  //   if (
  //     (likeError.status && !likeError.flag) ||
  //     (unlikeError.status && !unlikeError.flag)
  //   ) {
  //     // navigate("/");
  //   } else if (likeError.flagn || unlikeError.flag) {
  //   }
  // }, [likeError, unlikeError]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error.flag && <div>Error 발생!!!</div>}
      {!error.flag &&
        postList.map((post) => (
          <Post key={post.id} post={post} handleLike={handleLike} />
        ))}
    </div>
  );
}

export default PostList;
