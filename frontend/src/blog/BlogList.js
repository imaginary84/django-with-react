import React, { useEffect, useState, useMemo } from "react";
import { BlogItem } from "../components/BlogItem";
import { Row, Col, Divider, Pagination } from "antd";
import "../components/Blog.scss";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/useFetch";
import Axios from "axios";

export const BlogList = () => {
  const [dataList, setDataList] = useState({});
  const pageSize = useMemo(() => 10, []);
  const navigate = useNavigate();
  const handleBlogNewClick = () => {
    navigate("/blog/new/");
  };

  const BlogListFetch = async (page = 1) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: `/blog/?page_size=${pageSize}&page=${page}`,
      });

      setDataList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    BlogListFetch();
  }, []);

  return (
    <>
      <Row>
        <Col span={3}>
          <div className="header">글번호</div>
        </Col>
        <Col span={12}>
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
      {/* {dataList && JSON.stringify(dataList)} */}
      {dataList.results &&
        dataList.results.map((data) => <BlogItem key={data.id} data={data} />)}
      <Divider />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {dataList.results && (
          <Pagination
            defaultCurrent={1}
            total={dataList.count}
            pageSize={pageSize}
            onChange={(page) => {
              BlogListFetch(page);
            }}
          />
        )}
      </div>
      <hr />
      <input type="button" value="새 글" onClick={handleBlogNewClick} />
    </>
  );
};
