import React, { useEffect, useState } from "react";
import Axios from "axios";
import { deleteToken, setToken, useAppContext } from "appStore";

export default function useAuthAxios({ method, url, data = null, memo }) {
  const {
    store: { access, refresh },
    dispatch,
  } = useAppContext();
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [executeFunc, setExecuteFunc] = useState(() => {
    return request;
  });

  const firstAxios = Axios.create({
    headers: { Authorization: `Bearer ${access}` },
  });

  // console.log(data);

  async function request(input) {
    // const { data } = input;

    // const data = input ? input.data : null;
    console.log("data", input);

    try {
      const firstResponse = await firstAxios({
        method,
        url,
        data: input ? input : {},
      });
      setOutput(firstResponse.data);
      setError(false);
      setLoading(false);
    } catch (firstError) {
      const {
        data: { code },
        config: firstRequest,
      } = firstError.response;
      if (code === "token_not_valid") {
        try {
          const refreshResponse = await Axios({
            method: "post",
            url: "http://localhost:8000/accounts/token/refresh/",
            data: { refresh },
          });
          const { data } = refreshResponse;
          dispatch(setToken(data));

          firstRequest.headers = { Authorization: `Bearer ${data.access}` };
          const secondResponse = await Axios(firstRequest);

          setOutput(secondResponse.data);
          setError(false);
          setLoading(false);
        } catch (freshError) {
          dispatch(deleteToken());
          setError(true);
          setLoading(false);
        }
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    if (method.toUpperCase() === "GET") {
      request();
    } else {
    }
  }, [method, url, data]);

  return [output, loading, error, executeFunc];
}
