import React, { useState, useRef } from "react";
import { Button, Form, Input, notification } from "antd";
import { getBase64FromFile } from "utils/Base64";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";
import { axiosInstance } from "utils/useFetch";
import { parseErrorMessages } from "utils/form";
import { ImageEditor } from "imageEditor";

export default function PostNewForm() {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [previewPhoto, setPreviewPhoto] = useState({
    visible: false,
    base64: null,
  });
  const navigate = useNavigate();

  const handleFinish = async (fieldValues) => {
    if (fileRef.current.childNodes[0].files.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        photo: { validateStatus: "error", help: "사진을 등록해주세요~" },
      }));
      return false;
    }

    const { caption, location } = fieldValues;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("location", location);

    const imgBase64 = canvasRef.current.toDataURL("image/png", 1.0);
    var blobBin = atob(imgBase64.split(",")[1]); // base64 데이터 디코딩
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], { type: "image/png" }); // Blob 생성
    // console.log();
    // const fileName = "canvas_img_" + new Date().getMilliseconds() + ".png";
    formData.append("photo", file, fileRef.current.childNodes[0].files[0].name);

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
    <>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item label="Photo" name="photo" {...fieldErrors.photo}>
          <ImageEditor canvasRef={canvasRef} fileRef={fileRef} />
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
      </Form>
    </>
  );
}
