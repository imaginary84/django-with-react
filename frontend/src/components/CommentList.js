import React, { useEffect, useState } from "react";
import { Avatar, Button, Input, Tooltip } from "antd";
import moment from "moment";
import { useAppContext, addFunc } from "appStore";
import { useFetch } from "utils/useFetch";
import Axios from "axios";
import Comment from "./Comment";

export default function CommentList({ post }) {
  const [commentContent, setCommentContent] = useState("");
  const [commentList, setCommentList] = useState([]);
  const {
    store: { access },
    dispatch,
  } = useAppContext();

  const headers = { Authorization: `Bearer ${access}` };

  const [originCommentList, loading, error, fetchCommentList] = useFetch({
    headers,
    method: "GET",
    url: `http://localhost:8000/api/posts/${post.id}/comments/`,
  });

  useEffect(() => {
    fetchCommentList();
    dispatch(addFunc("fetchPostList", fetchCommentList));
  }, []);

  useEffect(() => {
    setCommentList(originCommentList);
  }, [originCommentList]);

  const handleClick = async () => {
    try {
      const data = { message: commentContent };
      const response = await Axios({
        method: "POST",
        url: `http://localhost:8000/api/posts/${post.id}/comments/`,
        headers,
        data,
      });

      setCommentList((prev) => [...prev, response.data]);
      setCommentContent("");
    } catch (error) {
      console.log("댓글쓰기 오류", error);
    }
  };

  return (
    <div>
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
