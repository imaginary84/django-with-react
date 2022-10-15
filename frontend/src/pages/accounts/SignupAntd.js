import React, { useEffect, useState } from "react";

import Axios from "axios";

import { Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const apiUrl = "http://localhost:8000/accounts/signup/";

const openNotification = () => {};

export default function Signup() {
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState({});

  //입력값 rule을 다 통과하면 실행되는 함수.
  const onFinish = (values) => {
    // Axios.post(apiUrl, data)
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error))
    //   .finally(() => {
    //     console.log("Axios post Ended");
    //   });

    async function fn() {
      const { username, password } = values;

      console.log(username, password);

      const data = { username, password };

      setFieldErrors({});

      try {
        await Axios.post(apiUrl, data);

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
          // fieldsErrorMessages  -> {username : ["message", "message2"], password: ["message", "message2"]}

          // const result = {};
          // for (let key in fieldsErrorMessages) {
          //   debugger;
          //   result[key] = {
          //     validateStatue: "error",
          //     help: fieldsErrorMessages[key].join(" "),
          //   };
          // }
          // console.log(result);
          // setFieldErrors(result);

          // 바로위 로직을 다른 문법으로 작성한 것.
          setFieldErrors(
            Object.entries(fieldsErrorMessages).reduce(
              (acc, [fieldName, errors]) => {
                // errors -> ["message", "message2"]
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

  const onFinishFailed = (values) => {
    console.log(values);
  };

  return (
    <div>
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
    </div>
  );
}
