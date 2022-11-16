import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_HOST } from "Constants";
import { useFetch } from "utils/useFetch";

export const BlogDetail = () => {
  const { pk } = useParams();
  const [author, setAuthor] = useState({});
  const [fileSet, setFileSet] = useState([]);

  const {
    dataList: blogDetail,
    loading,
    error,
    fetch,
  } = useFetch({
    url: `/blog/${pk}`,
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (blogDetail.author) {
      setAuthor(blogDetail.author);
    }
    if (blogDetail.file_set) {
      setFileSet(blogDetail.file_set);
    }
  }, [blogDetail.author, blogDetail.file_set]);

  return (
    <>
      <h1>BlogDetail - {pk}</h1>
      {blogDetail && <div>글번호 : {blogDetail.id}</div>}
      {blogDetail && <div>제목 : {blogDetail.title}</div>}
      {blogDetail && (
        <div style={{ whiteSpace: "pre-wrap" }}>
          내용 : {blogDetail.content}
        </div>
      )}
      {blogDetail && <div>작성일 : {blogDetail.created_at}</div>}
      {author && <div>작성자 :{author.username}</div>}
      {fileSet &&
        fileSet.map((file) => {
          return (
            <img
              key={file.blog + file.file}
              src={API_HOST + file.file}
              alt={file.blog + file.file}
              style={{ width: 1000 }}
            />
          );
          // return "asdf";
        })}
    </>
  );
};
