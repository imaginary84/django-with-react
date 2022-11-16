import React, { useRef, useState } from "react";
import { Row, Col } from "antd";
import "./BlogNewForm.scss";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "utils/useFetch";

export const BlogNewForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // console.log(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      for (let i = 0; i < files.length; i++) {
        // console.log(files[i]);
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
  const handleListClick = () => {
    navigate("/blog/");
  };

  const handleFileChange = (e) => {
    if (fileRef.current) {
      console.log(fileRef.current.files);
      setFiles(fileRef.current.files);
    }
  };

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
              <input
                type="file"
                id="file"
                multiple
                ref={fileRef}
                onChange={handleFileChange}
              />
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
