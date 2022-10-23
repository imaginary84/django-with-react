import React, { useEffect, useState } from "react";
import Axios from "axios";
import { deleteToken, setToken, useAppContext } from "appStore";
import { parseErrorMessages } from "utils/form";

/**
 *
 * @param {string} method ex> get, post
 * @param {string} url ex>http://localhost:8000/...
 * @param {object} data ex> {key:value}
 * @param {string} memo 개발자도구 콘솔에 남길때 사용될 메시지 구분용.
 * @returns output : 요청 결과 ,
 *  loading : 로딩 중 여부,
 *  error : 에러 여부,
 *  executeFunc : post요청시 요청이 바로 실행되지않고, 전달받은 함수를 콜하면 요청이 진행됨.
 */
export default function useAuthAxios({ method, url, data = null, memo }) {
  const {
    store: { access, refresh },
    dispatch,
  } = useAppContext();
  const [output, setOutput] = useState([]);
  const [error, setError] = useState({ flag: false });
  const [loading, setLoading] = useState(true);
  const [executeFunc, setExecuteFunc] = useState(() => {
    return request;
  });

  const firstAxios = Axios.create({
    headers: { Authorization: `Bearer ${access}` },
  });

  async function request(input) {
    setLoading(true);
    try {
      const firstResponse = await firstAxios({
        method,
        url,
        data: input ? input : {},
      });
      setOutput(firstResponse.data);
      setError({ flag: false, status: firstResponse.status });
      setLoading(false);
      console.log("useAuthAxios firstResponse", firstResponse, memo);
    } catch (firstError) {
      const { data, config: firstRequest, status } = firstError.response;
      // debugger;

      if (status < 500) {
        if (data.code === "token_not_valid") {
          try {
            const refreshResponse = await Axios({
              method: "post",
              url: "http://localhost:8000/accounts/token/refresh/",
              data: { refresh },
            });
            console.log(
              "useAuthAxios refreshResponse",
              refreshResponse.data,
              memo
            );
            const { data } = refreshResponse;
            dispatch(setToken(data));

            firstRequest.headers = { Authorization: `Bearer ${data.access}` };
            const secondResponse = await Axios(firstRequest);

            setOutput(secondResponse.data);
            setError({ flag: false, status: secondResponse.status });
            setLoading(false);
            console.log(
              "useAuthAxios secondResponse",
              secondResponse.data,
              memo
            );
          } catch (freshError) {
            dispatch(deleteToken());
            setError({
              flag: true,
              status: freshError.response.status,
              content: parseErrorMessages(freshError.response.data),
            });
            setLoading(false);
            console.log(
              "useAuthAxios refresh , second Error",
              freshError,
              memo
            );
          }
        } else {
          setError({
            flag: true,
            status: firstError.response.status,
            content: parseErrorMessages(data),
          });
          setLoading(false);
          console.log("useAuthAxios firstError", firstError, memo);
          // return Promise.reject();
        }
      } else {
        //500번대 상태에러.
        console.error("Http status - 50x :", firstError.message, memo);
        setError({ flag: true, status: firstError.response.status });
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (method.toUpperCase() === "GET") {
      request();
    } else {
    }
  }, [method, url, data]);

  return [output, loading, error, executeFunc];
}
