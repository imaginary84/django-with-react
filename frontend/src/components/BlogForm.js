import React, { useRef, useState, useEffect } from "react";
import { Row, Col, List, Button } from "antd";
import "./BlogNewForm.scss";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/useFetch";

import { DeleteOutlined } from "@ant-design/icons";

export const BlogForm = ({
  title,
  content,
  files,
  fileRef,
  handleSaveClick,
  handleTitleChange,
  handleContentChange,
  handleListClick,
  handleFileChange,
  handleFileDeleteClick,
}) => {
  return (
    <>
      <div>
        <Row className="row-mb">
          <Col span={24} className="flex">
            <Col span={4}>
              <span className="align-right">제목 : </span>
            </Col>
            <Col span={20}>
              <input
                type="text"
                id="title"
                style={{ width: "100%" }}
                value={title}
                onChange={handleTitleChange}
              />
            </Col>
          </Col>
        </Row>
        <Row className="row-mb">
          <Col span={24} className="flex">
            <Col span={4}>
              <span className="align-right">파일 : </span>
            </Col>
            <Col span={20}>
              <div>
                <label htmlFor="file">
                  <span
                    style={{
                      display: "inline-block",
                      border: "0.5px solid white",
                      textAlign: "center",
                      padding: "10px 20px",
                      fontWeight: "bolder",
                      backgroundColor: "#096dd9",
                      color: "white",
                    }}
                  >
                    업로드
                  </span>
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  ref={fileRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <div>
                <List
                  bordered
                  dataSource={files}
                  renderItem={(file, index) => (
                    <List.Item>
                      {file.name}
                      <span
                        onClick={() => {
                          handleFileDeleteClick(index);
                        }}
                      >
                        {" "}
                        - <DeleteOutlined />
                      </span>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Col>
        </Row>
        <Row className="row-mb">
          <Col span={24} className="flex">
            <Col span={4}>
              <span className="align-right">내용 : </span>
            </Col>
            <Col span={20}>
              <textarea
                id="content"
                style={{ width: "100%" }}
                rows={15}
                value={content}
                onChange={handleContentChange}
              />
            </Col>
          </Col>
        </Row>
        <Row className="row-mb">
          <Col span={24} className="flex">
            <Col span={20} offset={4} className="align-right">
              <input type="button" value="저장" onClick={handleSaveClick} />
              <input type="button" value="목록" onClick={handleListClick} />
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
};
