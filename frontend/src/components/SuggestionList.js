import React, { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import Suggestion from "./Suggestion";
import "./SuggestionList.scss";
import { axiosInstance } from "utils/useFetch";
import { useAppContext } from "appStore";
import { useFetch } from "utils/useFetch";

export default function SuggestionList({ style }) {
  const {
    dataList: originUserList,
    loading,
    error,
    fetch,
  } = useFetch({
    url: "/accounts/suggestions/",
  });

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!originUserList) setUserList([]);
    else
      setUserList(originUserList.map((user) => ({ ...user, isFollow: false })));
  }, [originUserList]);

  const [userList, setUserList] = useState([]);

  const onFollowUser = async (username) => {
    try {
      await axiosInstance({
        method: "POST",
        url: "/accounts/follow/",
        data: { following_user: username },
      });

      setUserList((prevUserList) => {
        let result = [];
        for (let i = 0; i < prevUserList.length; i++) {
          if (prevUserList[i].username !== username) {
            result.push(prevUserList[i]);
          }
        }
        return result;
      });
    } catch (err) {
      //오류처리
    }
  };

  return (
    <div style={style}>
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
      <Card size="small" title="회원님을 위한 추천">
        {userList.map((value, index) => {
          return (
            <Suggestion key={index} user={value} onFollowUser={onFollowUser} />
          );
        })}
      </Card>
    </div>
  );
}
