import React from "react";
import "./PostList2.scss";
import { useFetchPagination } from "utils/useFetch";

export default function PostList2({ username }) {
  // params: { username, profile: "Y" }

  const {
    dataList: postList,
    // setDataList,
    loading,
    error,
    more,
    page,
    finalPage,
  } = useFetchPagination({
    method: "GET",
    url: "/api/posts/",
    params: { username, profile: "Y" },
    initialPageSize: 12,
  });

  return (
    <div className="post-list">
      {postList.map((post) => (
        <div className="post" key={post.id}>
          <img
            src={post.photo}
            alt={"post.caption"}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ))}
      {page < finalPage && (
        <div
          id="test"
          style={{ height: "100px", width: "100px", backgroundColor: "red" }}
          ref={more}
        ></div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
    </div>
  );
}
