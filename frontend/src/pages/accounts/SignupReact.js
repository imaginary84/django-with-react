import React, { useEffect, useState } from "react";

import { axiosInstance } from "utils/useFetch";

import { Alert } from "antd";

import { useNavigate } from "react-router-dom";

const apiUrl = "/accounts/signup/";

export default function Signup() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fromDisabled, setFormDisabled] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = inputs;

    console.log("onSubmit", username, password);

    setLoading(true);

    setErrors({});

    axiosInstance
      .post(apiUrl, inputs)
      .then((response) => {
        console.log("response :", response);
        navigate("/accounts/login");
      })
      .catch((error) => {
        // console.log("error :", error);
        if (error.response) {
          console.log("error.response :", error.response);
          setErrors((prev) => {
            return {
              ...prev,
              username: (error.response.data.username || []).join(""),
              password: (error.response.data.password || []).join(""),
            };
          });
          // debugger;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    // const isDisabled =
    //   inputs.username.length === 0 || inputs.password.length === 0;

    //   setFormDisabled(isDisabled);

    // 위 주석 내용과 동일 로직이지만. js에 생소한 기능으로 구현함.
    const isEnabled = Object.values(inputs).every((s) => s.length > 0);

    setFormDisabled(!isEnabled);
  }, [inputs]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          ID : <input type="text" name="username" onChange={onChange} />
          {errors.username && (
            <Alert message={errors.username} type="error" showIcon />
          )}
        </div>
        <div>
          PW : <input type="password" name="password" onChange={onChange} />
          {errors.password && (
            <Alert message={errors.password} type="error" showIcon />
          )}
        </div>
        <input
          type="submit"
          value="회원가입"
          disabled={loading || fromDisabled}
        />
      </form>
    </div>
  );
}
