import React from "react";
import { Row, Col } from "antd";
import "./Blog.scss";
import moment from "moment";
import { Link } from "react-router-dom";

export const BlogItem = ({ data }) => {
  return (
    <>
      <Row>
        <Col span={3}>
          <div className="header">{data.id}</div>
        </Col>
        <Col span={15}>
          <div className="header ctt-title">
            <Link to={`detail/${data.id}`}>{data.title}</Link>
          </div>
        </Col>
        <Col span={3}>
          <div className="header">{data.author.username}</div>
        </Col>
        <Col span={3}>
          <div className="header">
            {/* {data.created_at} */}
            {/* {moment(data.created_at).format("YYYY-MM-DD, h:mm:ss a")} */}
            {moment(data.created_at).format("YYYY. MM. DD.")}
          </div>
        </Col>
      </Row>
    </>
  );
};
