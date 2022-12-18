import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { API_HOST } from "Constants";
import { axiosInstance, useFetch } from "utils/useFetch";
import {
  Button,
  Collapse,
  PageHeader,
  Descriptions,
  List,
  Row,
  Col,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { DeleteOutlined } from "@ant-design/icons";
import { getCookie } from "utils/getCookie";

export const BlogDetail = () => {
  const { pk } = useParams();
  const [author, setAuthor] = useState({});
  const [fileSet, setFileSet] = useState([]);
  const loginUser = useMemo(() => getCookie("username"), []);
  const navigate = useNavigate();

  const {
    dataList: blogDetail,
    loading,
    error,
    fetch,
  } = useFetch({
    url: `/blog/${pk}/`,
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

  const handleFileDeleteClick = async (fileId) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const response = await axiosInstance({
          method: "DELETE",
          url: `/blog/files/${fileId}/`,
        });
        console.log("파일삭제 성공", response);

        setFileSet((prevFileSet) =>
          prevFileSet.reduce((acc, cur) => {
            if (cur.id !== fileId) {
              acc.push(cur);
            }

            return acc;
          }, [])
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleListClick = () => {
    navigate("/blog/");
  };

  const handleEditClick = () => {
    navigate(`/blog/${pk}/edit/`);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axiosInstance({
        method: "DELETE",
        url: `/blog/${pk}/`,
      });
      console.log("게시물 삭제 성공", response);
      navigate("/blog/");
    } catch (error) {
      console.log("게시물 삭제 실패", error);
    }
  };

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={blogDetail.title}
        subTitle={"BlogDetail"}
        extra={[
          loginUser === author.username ? (
            <Button key="3" onClick={handleEditClick}>
              수정
            </Button>
          ) : (
            ""
          ),
          loginUser === author.username ? (
            <Button key="2" onClick={handleDeleteClick}>
              삭제
            </Button>
          ) : (
            ""
          ),
          <Button key="1" type="primary" onClick={handleListClick}>
            목록
          </Button>,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="글번호">{pk}</Descriptions.Item>
          <Descriptions.Item label="작성자">
            {author.username}
          </Descriptions.Item>
          <Descriptions.Item label="작성일">
            {moment(blogDetail.created_at).format("YYYY-MM-DD, a h:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      {loginUser === author.username ? (
        <Collapse>
          <Collapse.Panel header="파일목록" key="1">
            <List
              bordered
              dataSource={fileSet}
              renderItem={(file) => (
                <List.Item>
                  {file.filename.split("/").pop()}{" "}
                  <span
                    onClick={() => {
                      handleFileDeleteClick(file.id);
                    }}
                  >
                    {loginUser === author.username ? <DeleteOutlined /> : ""}
                  </span>
                </List.Item>
              )}
            />
          </Collapse.Panel>
        </Collapse>
      ) : (
        ""
      )}
      {blogDetail && (
        <Row style={{ marginBottom: "2rem" }}>
          <Col offset={4} span={16}>
            <div style={{ whiteSpace: "pre-wrap" }}>{blogDetail.content}</div>
          </Col>
        </Row>
      )}
      {fileSet &&
        fileSet.map((file) => {
          return (
            <Row
              key={file.blog + file.filename}
              style={{ marginBottom: "2rem" }}
            >
              <Col offset={4} span={16}>
                <img
                  src={file.filename}
                  alt={file.blog + file.filename}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          );
        })}
    </>
  );
};
