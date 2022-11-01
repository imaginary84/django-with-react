import { useState, useMemo, useEffect, useRef } from "react";
import Axios from "axios";
import { useAppContext } from "appStore";

/**
 *
 * @param {object} {method, url, headers, data, params}
 * @returns [data, loading, error, fetchFunc]
 */

export function useFetch({ url, method }) {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${access}` }),
    [access]
  );

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const fetch = async () => {
    try {
      setLoading(true);

      const response = await Axios({ method, url, headers });

      setLoading(false);
      setDataList(response.data);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { dataList, loading, error };
}

export function useExecute({ method, url }) {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${access}` }),
    [access]
  );

  const executeFunc = async ({ data, url2 = "" }) => {
    try {
      const response = await Axios({ method, url: url + url2, headers, data });

      console.log("useExecute - ", response);

      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };

  return { executeFunc };
}

export function useFetchPagination({ method, url, params, iPageSize }) {
  const { store, dispatch } = useAppContext();
  const { access, refresh, username } = store;
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${access}` }),
    [access]
  );
  const [page, setPage] = useState(1); //현재 페이지
  const [finalPage, setFinalPage] = useState(1); //마지막 페이지
  const [pageSize, setPageSize] = useState(iPageSize); //페이지당 갯수
  const [infinite, setInfinite] = useState(false); // 스크롤 페이징은 초기 조회 후부터 IntersectionObserver에 감시를 받도록하기위하여.
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

      const response = await Axios({
        method,
        url: url + `?page=${page}&page_size=${pageSize}`,
        headers,
        params,
      });
      setLoading(false);
      setAppendDataList(response.data.results);
      setInfinite(true);
      setFinalPage(Math.ceil(response.data.count / pageSize));
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  // 마운트시와 페이지가 변경될때 조회함수를 실행함.
  useEffect(() => {
    //초기 조회전에는 1==1로 조회, 향후 는 각각 제대로 된 값으로 평가됨.
    // if (page <= finalPage  ) {
    dataListFecth();
    // }
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
    if (infinite && finalPage !== 1) {
      //옵져버 탐색 시작
      // console.log(infinite, page, finalPage);
      observer.observe(more.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [infinite]);

  return { dataList, setDataList, loading, error, more, page, finalPage };
}
