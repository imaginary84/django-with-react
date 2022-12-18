import React, { useState, useRef } from "react";
import { BlogForm } from "components/BlogForm";
import { axiosInstance } from "utils/useFetch";
import { useNavigate } from "react-router-dom";

export const BlogNew = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await axiosInstance({
        method: "POST",
        url: "/blog/",
        data: formData,
      });
      console.log("블로그 글쓰기 성공", response);
      navigate("/blog/");
    } catch (err) {
      console.log("블로그 글쓰기 실패", err);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleListClick = () => {
    navigate("/blog/");
  };

  const handleFileChange = (e) => {
    if (fileRef.current) {
      setFiles(() => Array.from(fileRef.current.files));
    }
  };

  const handleFileDeleteClick = (deleteIndex) =>
    setFiles((prevFiles) =>
      prevFiles.filter((file, index) => index !== deleteIndex)
    );

  return (
    <>
      <h1>새 글 쓰기</h1>
      <BlogForm
        title={title}
        content={content}
        files={files}
        fileRef={fileRef}
        handleSaveClick={handleSaveClick}
        handleTitleChange={handleTitleChange}
        handleContentChange={handleContentChange}
        handleListClick={handleListClick}
        handleFileChange={handleFileChange}
        handleFileDeleteClick={handleFileDeleteClick}
      />
    </>
  );
};
