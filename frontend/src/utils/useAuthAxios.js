import { useEffect, useState } from "react";
import Axios from "axios";
import { deleteToken, setToken, useAppContext } from "appStore";

export default function useAuthAxios({ method, url, data = null, memo }) {
  const {
    store: { access, refresh },
    dispatch,
  } = useAppContext();
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const firstAxios = Axios.create({
      headers: { Authorization: `Bearer ${access}` },
    });

    firstAxios({ method, url, data })
      .then((firstResponse) => {
        // console.log(`In useAuthAxio - firstResponse ${memo}:`, firstResponse);

        setOutput(firstResponse.data);
        setError(false);
      })
      .catch((firstError) => {
        const {
          data: { code },
          config: firstRequest,
        } = firstError.response;

        //토큰 오류
        if (code === "token_not_valid") {
          Axios.post("http://localhost:8000/accounts/token/refresh/", {
            refresh,
          })
            .then((refreshResponse) => {
              const { data } = refreshResponse;
              dispatch(setToken(data));

              firstRequest.headers = { Authorization: `Bearer ${data.access}` };
              Axios(firstRequest).then((secondResponse) => {
                // console.log(
                //   `In useAuthAxio - secondResponse ${memo}:`,
                //   secondResponse
                // );

                setOutput(secondResponse.data);
                setError(false);
              });
            })
            .catch((secondError) => {
              //리프레쉬 토큰이 만료된 상태 또는 그에 준하는 상태임.
              //현상태이면 로그아웃 처리가 되어야함.
              // console.log(
              //   `토큰 만료에 의한 로그아웃 ${memo}`,
              //   secondError.response
              // );

              dispatch(deleteToken());
              setError(true);
            });
        } else {
          // console.log(`토큰 만료 외 오류 발생 ${memo}`, firstError.response);

          setError(true);
        }
      });
  }, [method, url, data]);

  return [output, error];
}
