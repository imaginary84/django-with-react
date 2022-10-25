import React, { useEffect, useMemo, useState } from "react";
import Post from "./Post";
import Axios from "axios";
import { useAppContext, addFunc } from "appStore";
import { useFetch } from "utils/useFetch";

function PostList() {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const headers = useMemo(() => ({ Authorization: `Bearer ${access}` }), []);

  const [originPostList, loading, error, fetchPostList] = useFetch({
    headers,
    method: "GET",
    url: "http://localhost:8000/api/posts/",
  });

  useEffect(() => {
    fetchPostList();
    dispatch(addFunc("fetchPostList", fetchPostList));
  }, []);

  /*
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const postList = async () => {
      try {
        setLoading(true);

        const response = await Axios({
          method: "GET",
          url: "http://localhost:8000/api/posts/",
          headers,
        });
        setLoading(false);
        setPostList(response.data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    postList();
  }, [headers]);
  */

  const handleLike = async ({ post, is_like }) => {
    try {
      if (is_like)
        await Axios({
          method: "POST",
          url: `http://localhost:8000/api/posts/${post.id}/like/`,
          headers,
        });
      else
        await Axios({
          method: "DELETE",
          url: `http://localhost:8000/api/posts/${post.id}/like/`,
          headers,
        });

      setPostList((prevPostList) =>
        prevPostList.map((prevPost) => {
          if (prevPost.id === post.id) {
            prevPost.is_like = !prevPost.is_like;
          }
          return prevPost;
        })
      );
    } catch (error) {
      console.log("error", error);
      if (error.response) {
      }
    }
  };

  const [postList, setPostList] = useState([]);

  useEffect(() => {
    setPostList([...originPostList]);
  }, [originPostList]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
      {postList &&
        postList.map((post) => (
          <Post key={post.id} post={post} handleLike={handleLike} />
        ))}
    </div>
  );
}

export default PostList;
