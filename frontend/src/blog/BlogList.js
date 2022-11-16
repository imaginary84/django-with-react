import React, { useEffect } from "react";
import { BlogItem } from "../components/BlogItem";
import { Row, Col, Divider } from "antd";
import "../components/Blog.scss";
import { useNavigate } from "react-router-dom";
import { useFetch } from "utils/useFetch";

export const BlogList = () => {
  const navigate = useNavigate();
  const handleBlogNewClick = () => {
    navigate("/blog/new/");
  };

  const { dataList, fetch: BlogListFetch } = useFetch({
    url: "/blog/",
    method: "GET",
  });

  useEffect(() => {
    BlogListFetch();
  }, []);

  return (
    <>
      <Row>
        <Col span={3}>
          <div className="header">글번호</div>
        </Col>
        <Col span={15}>
          <div className="header">제목</div>
        </Col>
        <Col span={3}>
          <div className="header">작성자</div>
        </Col>
        <Col span={3}>
          <div className="header">작성일</div>
        </Col>
      </Row>
      <Divider />
      {dataList.map((data) => (
        <BlogItem key={data.id} data={data} />
      ))}
      <Divider />
      Pagination 1,2,3,4,5
      <hr />
      <input type="button" value="새 글" onClick={handleBlogNewClick} />
    </>
  );
};
