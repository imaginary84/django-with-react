import React, { useState } from "react";

import Axios from "axios";

import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { useAppContext, setToken, deleteToken } from "appStore";

function Login() {
  const { dispatch } = useAppContext();
  // const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});

  const onFinish = (values) => {
    async function fn() {
      const { username, password } = values;

      const data = { username, password };

      setFieldErrors({});

      try {
        const response = await Axios.post(
          "http://localhost:8000/accounts/token/",
          data
        );

        const {
          data: { token: jwtToken },
        } = response;

        dispatch(setToken(jwtToken));

        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });

        // navigate("/accounts/login");
      } catch (error) {
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: "아이디/암호를 확인해 주세요.",
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
          const { data: fieldsErrorMessages } = error.response;

          setFieldErrors(
            Object.entries(fieldsErrorMessages).reduce(
              (acc, [fieldName, errors]) => {
                acc[fieldName] = {
                  validateStatus: "error",
                  help: errors.join(" "),
                };
                return acc;
              },
              {}
            )
          );
        }
      }
    }

    fn();
  };

  return (
    <Card title="로그인">
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
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
          {...fieldErrors.non_field_errors}
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

export default Login;
