import React, { useCallback, useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useExecute, useFetch } from "utils/useFetch";
import Comment from "./Comment";

export default function CommentList({ post }) {
  const [commentContent, setCommentContent] = useState("");
  const [commentList, setCommentList] = useState([]);

  const {
    dataList: originCommentList,
    loading,
    error,
  } = useFetch({
    method: "GET",
    url: `http://localhost:8000/api/posts/${post.id}/comments/`,
  });

  useEffect(() => {
    setCommentList(originCommentList);
  }, [originCommentList]);

  const { execute: commentFunc } = useExecute({
    method: "POST",
    url: `http://localhost:8000/api/posts/${post.id}/comments/`,
  });

  const handleClick = useCallback(async () => {
    try {
      const response = await commentFunc({ data: { message: commentContent } });

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
