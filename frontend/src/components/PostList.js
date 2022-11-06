import React, { useMemo } from "react";
import Post from "./Post";
import { useAppContext } from "appStore";
import { useFetchPagination, axiosInstance } from "utils/useFetch";

function PostList() {
  const {
    dataList: postList,
    setDataList: setPostList,
    loading,
    error,
    more,
    page,
    finalPage,
  } = useFetchPagination({
    method: "GET",
    url: "/api/posts/",
    // params: { username, profile: "N" },
    initialPageSize: 10,
  });

  //좋아요 를 처리하는 함수.
  const handleLike = async ({ post, is_like }) => {
    try {
      await axiosInstance({
        method: is_like ? "POST" : "DELETE",
        url: `/api/posts/${post.id}/like/`,
      });

      setPostList((prevPostList) =>
        prevPostList.map((prevPost) => {
          return prevPost.id === post.id ? { ...prevPost, is_like } : prevPost;
        })
      );
    } catch (error) {
      console.log("error", error);
      if (error.response) {
      }
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
      {postList &&
        postList.map((post) => (
          <Post key={post.id} post={post} handleLike={handleLike} />
        ))}
      {/* 현재 페이지가 마지막 페이지에 도달하지않았을 경우에만 more를 화면에 그린다.  */}
      {postList && page < finalPage && (
        <div
          id="test"
          style={{ height: "100px", width: "100px" }}
          ref={more}
        ></div>
      )}
    </div>
  );
}

export default PostList;
