import React, { useState } from "react";
import { Button, Form, Input, Modal, Upload, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64FromFile } from "utils/Base64";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";
import { axiosInstance } from "utils/useFetch";
import { useAppContext } from "appStore";
import { parseErrorMessages } from "utils/form";

export default function PostNewForm() {
  const [fieldErrors, setFieldErrors] = useState({});
  const [fileList, setFileList] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState({
    visible: false,
    base64: null,
  });
  const navigate = useNavigate();

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handlePreviewPhoto = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64FromFile(file.originFileObj);
    }
    setPreviewPhoto({ visible: true, base64: file.url || file.preview });
  };

  const handleFinish = async (fieldValues) => {
    const {
      photo: { fileList },
      caption,
      location,
    } = fieldValues;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);
    fileList.forEach((file) => {
      formData.append("photo", file.originFileObj);
    });

    try {
      const response = await axiosInstance({
        method: "POST",
        url: "/api/posts/",
        data: formData,
      });

      navigate("/");
    } catch (error) {
      if (error.response) {
        const { status, data: fieldsErrorMessages } = error.response;
        // setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        if (typeof fieldsErrorMessages === "string") {
          console.error(`HTTP-${status} 응답을 받았습니다.`);

          notification.open({
            message: "서버 오류",
            description: `HTTP-${status} 응답을 받았습니다. 서버 에러를 확인해 주세요.`,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        } else {
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }
  };

  return (
    <Form
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      onFinish={handleFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Photo"
        name="photo"
        rules={[{ required: true, message: "사진을 입력해주세요." }]}
        hasFeedback
        {...fieldErrors.photo}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleUploadChange}
          onPreview={handlePreviewPhoto}
        >
          {fileList.length > 0 ? null : (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item
        label="Caption"
        name="caption"
        rules={[
          {
            required: true,
            message: "Caption을 입력해주세요",
          },
        ]}
        hasFeedback
        {...fieldErrors.caption}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label="Location"
        name="location"
        rules={[
          {
            required: true,
            message: "Location을 입력해주세요",
          },
        ]}
        hasFeedback
        {...fieldErrors.location}
      >
        <Input />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          저장
        </Button>
      </Form.Item>
      <Modal
        open={previewPhoto.visible}
        footer={null}
        onCancel={() => setPreviewPhoto({ visible: false })}
        width={1000}
      >
        <img
          src={previewPhoto.base64}
          alt={"Preview"}
          style={{ width: "100%" }}
        />
      </Modal>
      <hr />
      {/* {JSON.stringify(error)} */}
      {/* {JSON.stringify(fileList)}
      {JSON.stringify(previewPhoto)}
      {error.flag && JSON.stringify(error.content)} */}
    </Form>
  );
}
