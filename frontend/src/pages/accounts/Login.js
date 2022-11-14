import React, { useState } from "react";
import Axios from "axios";
import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext, setToken } from "appStore";
import { parseErrorMessages } from "utils/form";
import { API_HOST } from "Constants";

import "./accounts.scss";

function Login() {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [fieldErrors, setFieldErrors] = useState({});

  // const [profile, setProfile] = useState(null);
  const { from: loginRedirectUrl } = location.state || { from: "/" }; //LoginRequiredRoute에서 로그인 안되어있을대 useNavigate 또는 <Navigate />로 state 지정 가능. // 비로그인상태에서 로그인필요페이지 접근시 로그인페이지로 유도후에 로그인후 자동으로 이동할곳을 지정하고자함.

  const onFinish = (values) => {
    async function fn() {
      try {
        const { username, password } = values;
        const logindata = { username, password };

        setFieldErrors({});

        const response = await Axios({
          method: "POST",
          url: API_HOST + "/accounts/login/",
          data: logindata,
        });

        const { data } = response;

        dispatch(setToken(data));

        notification.open({
          message: "로그인 성공",
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });

        navigate(loginRedirectUrl);
      } catch (error) {
        console.log(error);
        if (error.response) {
          notification.open({
            message: "로그인 실패",
            description: `아이디/암호를 확인해 주세요.`,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });

          const { data: fieldsErrorMessages } = error.response;
          setFieldErrors(parseErrorMessages(fieldsErrorMessages));
        }
      }
    }

    fn();
  };

  return (
    <div className="layout">
      <Card className="login" title="로그인">
        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
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
            {...fieldErrors.detail}
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
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
