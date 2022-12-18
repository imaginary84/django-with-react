import React, { useEffect, useState, useRef } from "react";
import { BlogForm } from "components/BlogForm";
import { Row, Col } from "antd";
import { useFetch, axiosInstance } from "utils/useFetch";
import { useParams, useNavigate } from "react-router-dom";

export const BlogEdit = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { pk } = useParams();
  const {
    dataList: blogDetail,
    loading,
    error,
    fetch,
  } = useFetch({
    url: `/blog/${pk}/`,
  });
  useEffect(() => {
    if (blogDetail.length === 0) {
      fetch();
    } else {
      setTitle(blogDetail.title);
      setContent(blogDetail.content);
    }
  }, [blogDetail]);

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      // const data = { title: title, content: content };

      const response = await axiosInstance({
        method: "PUT",
        url: `/blog/${pk}/`,
        data: formData,
      });
      console.log("블로그 글수정 성공", response);
      navigate(`/blog/${pk}/`);
    } catch (err) {
      console.log("블로그 글수정 실패", err);
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
      <h1>글 수정</h1>
      {blogDetail && (
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
      )}
    </>
  );
};
