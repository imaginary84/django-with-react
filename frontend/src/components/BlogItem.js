import React from "react";
import { Row, Col } from "antd";
import "./Blog.scss";
import moment from "moment";
import { Link } from "react-router-dom";
import { API_HOST } from "Constants";
import { FileImageOutlined } from "@ant-design/icons";

export const BlogItem = ({ data }) => {
  return (
    <>
      <Row>
        <Col span={3}>
          <div className="header">{data.id}</div>
        </Col>
        <Col span={12}>
          <div className="header ctt-title">
            <Link to={`${data.id}`}>
              {data.file_exist ? <FileImageOutlined /> : ""}
              {data.title}
            </Link>
          </div>
        </Col>
        <Col span={3}>
          <div className="header">{data.author.username}</div>
        </Col>
        <Col span={3}>
          <div className="header">
            {moment(data.created_at).format("YYYY. MM. DD.")}
          </div>
        </Col>
      </Row>
    </>
  );
};
