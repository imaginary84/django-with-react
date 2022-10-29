import { useState } from "react";
import Axios from "axios";
import { useAppContext, addFunc } from "appStore";

/**
 *
 * @param {object} {method, url, headers, data, params}
 * @returns [data, loading, error, fetchFunc]
 */
export const useFetch = ({
  method,
  url,
  headers,
  data,
  params,
  funcName,
  pagination = false,
}) => {
  const { store, dispatch } = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const fetch = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        method,
        url,
        headers,
        data,
        params,
      });
      setLoading(false);
      setDataList(pagination ? response.data.results : response.data);
    } catch (error) {
      console.log("useFetch error -", error);
      setError(true);
      setLoading(false);
    }
  };

  return [dataList, loading, error, fetch];
};
