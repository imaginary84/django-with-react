import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { API_HOST } from "Constants";
import { getCookie } from "./getCookie";

export const axiosInstance = Axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  headers: {
    "X-CSRFToken": getCookie("csrftoken"),
  },
});

axiosInstance.interceptors.request.use(
  async function (config) {
    try {
      const res1 = await Axios({
        method: "POST",
        url: API_HOST + "/accounts/refresh/",
        withCredentials: true,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data: {
          refresh: JSON.parse(window.localStorage.getItem("refresh")),
        },
      });

      window.localStorage.setItem("refresh", JSON.stringify(res1.data.refresh));

      return config;
    } catch (err) {
      window.localStorage.setItem("refresh", '""');

      window.location.href = "/";

      return Promise.reject({
        status: "logout",
        message: "리프레쉬 토큰 만료됨. 로그아웃 상태.",
      });
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function useFetch({ url, method = "GET" }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const fetch = async (input) => {
    try {
      setLoading(true);

      const response = await axiosInstance({ method, url, data: input });

      setLoading(false);
      setDataList(response.data);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  };

  return { dataList, setDataList, loading, error, fetch };
}

export function useFetchPagination({
  method = "GET",
  url,
  params,
  initialPageSize,
}) {
  const [page, setPage] = useState(1); //현재 페이지
  const [finalPage, setFinalPage] = useState(1); //마지막 페이지
  const [pageSize] = useState(initialPageSize); //페이지당 갯수
  const more = useRef();

  // JWT토큰을 갖는 헤더 생성.

  // 조회의 결과, 로딩여부, 에러 여부를 관리할 상태변수 선언.
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appendDataList, setAppendDataList] = useState([]);

  // 조회 및 로딩제어, 에러제어 함수.
  const dataListFecth = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance({
        method,
        url: url + `?page=${page}&page_size=${pageSize}`,
        params,
      });
      // console.log("요청 성공", response);
      setLoading(false);
      setAppendDataList(response.data.results);
      setFinalPage(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      console.log("요청 실패", error);
      setError(true);
      setLoading(false);
    }
  };

  // 마운트시와 페이지가 변경될때 조회함수를 실행함.
  useEffect(() => {
    dataListFecth();
  }, [page]);

  //appendPostList는 페이지 단위로 데이터를 보관, postList는 화면에 보여줄 전체 목록.
  const [dataList, setDataList] = useState([]);

  // appendPostList의 내용이 변경될때마다, postList에 appendPostList를 덫붙임.
  useEffect(() => {
    setDataList((prev) => [...prev, ...appendDataList]);
  }, [appendDataList]);

  //infinite 변수는 처음에 false상태에서 최초 조회가 성공하고나면 truer가됨.
  //true가 되면 지정한 more component가 추척하여 화면에 나타나면 페이지를 다음페이지로 증가시킴.
  const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      setPage((prev) => {
        return prev + 1;
      });
    }
  });

  //infinite는 마운트시 false라서 IntersectionObserver의 감시가 시작되지않음. 첫조회 후 true변화하면서 감시 시작됨.
  // 첫 조회전후로 하여 마지막 페이지가 1페이지인경우 감시하지않는다.
  useEffect(() => {
    // console.log(infinite);
    // debugger;
    if (finalPage !== 1 && more.current) {
      //옵져버 탐색 시작
      observer.observe(more.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [finalPage]);

  return { dataList, setDataList, loading, error, more, page, finalPage };
}
