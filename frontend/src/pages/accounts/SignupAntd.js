import React, { useEffect, useState } from "react";

import { axiosInstance } from "utils/useFetch";

import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { parseErrorMessages } from "utils/form";
import Axios from "axios";
import { API_HOST } from "Constants";

const apiUrl = "";

export default function Signup() {
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});

  //입력값 rule을 다 통과하면 실행되는 함수.
  const onFinish = (values) => {
    async function fn() {
      try {
        const { username, password } = values;

        const data = { username, password };

        setFieldErrors({});

        // const response = await axiosInstance.post("/accounts/signup/", data);
        const response = await Axios({
          method: "post",
          url: API_HOST + "/accounts/signup/",
          data,
        });

        notification.open({
          message: "회원가입 성공",
          description: "로그인 페이지로 이동합니다.",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });

        navigate("/accounts/login");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "회원가입 실패",
            description: "아이디/암호를 확인해 주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldsErrorMessages } = error.response;
          console.log(fieldsErrorMessages);
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));

          //중복된 아이디로 회원가입 시도시.
          // fieldsErrorMessages는 {username: ['해당 사용자 이름은 이미 존재합니다.']} 이런 값이 있음.
          // antd의 Form.Item에서 에러 표현을 위해서는  { username: {validateStatus: "error", help: "해당 사용자 이름은 이미 존재합니다."}} 이런 형태로 바꿔줘야함.
          // 그래서 쉽게 변환 하기위해 parseErrorMessages를 만듬. 만들어서 setFieldErrors 해주면 끝.
        }
      }
    }

    fn();
  };

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <Card title="회원가입">
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
            {
              min: 5,
              message: "5글자 이상 입력해야합니다.",
            },
          ]}
          hasFeedback
          {...fieldErrors.username} //validatestatue="" help=""
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
          {...fieldErrors.password} //validatestatue="" help=""
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
