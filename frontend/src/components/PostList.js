import React, { useEffect, useMemo, useState, useRef } from "react";
import Post from "./Post";
import Axios from "axios";
import { useAppContext } from "appStore";

function PostList() {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const [page, setPage] = useState(1); //현재 페이지
  const [finalPage, setFinalPage] = useState(1); //마지막 페이지
  const [pageSize, setPageSize] = useState(3); //페이지당 갯수
  const [infinite, setInfinite] = useState(false); // 스크롤 페이징은 초기 조회 후부터 IntersectionObserver에 감시를 받도록하기위하여.
  const more = useRef();

  // JWT토큰을 갖는 헤더 생성.
  const headers = useMemo(() => ({ Authorization: `Bearer ${access}` }), []);

  // 조회의 결과, 로딩여부, 에러 여부를 관리할 상태변수 선언.
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appendPostList, setAppendPostList] = useState([]);

  // 조회 및 로딩제어, 에러제어 함수.
  const postListFecth = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        method: "GET",
        url: `http://localhost:8000/api/posts/?page=${page}&page_size=${pageSize}`,
        headers,
      });
      setLoading(false);
      setAppendPostList(response.data.results);
      setInfinite(true);
      setFinalPage(Math.round(response.data.count / pageSize));
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  // 마운트시와 페이지가 변경될때 조회함수를 실행함.
  useEffect(() => {
    //초기 조회전에는 1==1로 조회, 향후 는 각각 제대로 된 값으로 평가됨.
    if (finalPage >= page) {
      postListFecth();
    }
  }, [page]);

  //appendPostList는 페이지 단위로 데이터를 보관, postList는 화면에 보여줄 전체 목록.
  const [postList, setPostList] = useState([]);

  // appendPostList의 내용이 변경될때마다, postList에 appendPostList를 덫붙임.
  useEffect(() => {
    setPostList((prev) => [...prev, ...appendPostList]);
  }, [appendPostList]);

  //infinite 변수는 처음에 false상태에서 최초 조회가 성공하고나면 truer가됨.
  //true가 되면 지정한 more component가 추척하여 화면에 나타나면 페이지를 다음페이지로 증가시킴.
  const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      setPage((prev) => {
        return prev + 1;
      });
    }
  });

  //infinite는 마운트시 false라서 IntersectionObserver의 감시가 시작되지않음. 첫조회 후 true변화하면서 감시 시작됨.
  useEffect(() => {
    if (infinite) {
      //옵져버 탐색 시작
      observer.observe(more.current);
    }
    return () => observer.disconnect();
  }, [infinite]);

  //좋아요 를 처리하는 함수.
  const handleLike = async ({ post, is_like }) => {
    try {
      await Axios({
        method: is_like ? "POST" : "DELETE",
        url: `http://localhost:8000/api/posts/${post.id}/like/`,
        headers,
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
      {postList && (
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
