import React, { useEffect, useMemo, useState, useRef } from "react";
import Post from "./Post";
import Axios from "axios";
import { useAppContext } from "appStore";
import { useExecute, useFetchPagination } from "utils/useFetch";

function PostList() {
  const { store, dispatch } = useAppContext();
  const { access, refresh, username } = store;
  const headers = useMemo(() => ({ Authorization: `Bearer ${access}` }), []);

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
    url: "http://localhost:8000/api/posts/",
    params: { username, profile: "N" },
    iPageSize: 10,
  });

  const { executeFunc: likeFunc } = useExecute({
    method: "POST",
    url: `http://localhost:8000/api/posts/`,
  });

  const { executeFunc: unlikeFunc } = useExecute({
    method: "DELETE",
    url: `http://localhost:8000/api/posts/`,
  });

  //좋아요 를 처리하는 함수.
  const handleLike = async ({ post, is_like }) => {
    try {
      if (is_like) await likeFunc({ url2: post.id + "/like/" });
      else await unlikeFunc({ url2: post.id + "/like/" });

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
      {page + " / " + finalPage}
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
