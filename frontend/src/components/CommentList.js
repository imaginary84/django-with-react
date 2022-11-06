import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Button, Input } from "antd";
import { useFetch } from "utils/useFetch";
import Comment from "./Comment";
import { axiosInstance } from "utils/useFetch";
import { useAppContext } from "appStore";
import { API_HOST } from "Constants";

export default function CommentList({ post }) {
  const [commentContent, setCommentContent] = useState("");
  const [commentList, setCommentList] = useState([]);

  const {
    dataList: originCommentList,
    loading,
    error,
    fetch,
  } = useFetch({
    url: `/api/posts/${post.id}/comments/`,
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setCommentList(originCommentList);
  }, [originCommentList]);

  const handleClick = useCallback(async () => {
    try {
      const response = await axiosInstance({
        method: "POST",
        url: `/api/posts/${post.id}/comments/`,
        data: { message: commentContent },
      });

      setCommentList((prev) => [...prev, response.data]);
      setCommentContent("");
    } catch (error) {
      console.log("댓글쓰기 오류", error);
    }
  }, [commentContent]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
      {commentList &&
        commentList.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}

      <Input.TextArea
        style={{ marginBottom: "0.5em" }}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      />
      <Button
        block
        type="primary"
        disabled={commentContent ? false : true}
        onClick={handleClick}
      >
        댓글 쓰기
      </Button>
    </div>
  );
}
