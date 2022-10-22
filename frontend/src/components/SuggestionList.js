import React, { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import Suggestion from "./Suggestion";
import "./SuggestionList.scss";
import useAuthAxios from "utils/useAuthAxiosAsynAwait";

export default function SuggestionList({ style }) {
  const [userList, setUserList] = useState([]);

  const [originUserList, loading, error] = useAuthAxios({
    method: "get",
    url: "http://localhost:8000/accounts/suggestions/",
    memo: "팔로우 할 유저리스트 조회",
  });

  const [following, loadingFolloing, errorFolloing, executeFollow] =
    useAuthAxios({
      method: "post",
      url: "http://localhost:8000/accounts/follow/",
      data: {},
      memo: "팔로우",
    });

  useEffect(() => {
    if (!originUserList) setUserList([]);
    else
      setUserList(originUserList.map((user) => ({ ...user, isFollow: false })));
  }, [originUserList]);

  const onFollowUser = (username) => {
    //
    // console.log(username);
    setUserList((prevUserList) => {
      return prevUserList.map((user) => {
        if (user.username === username) {
          user.isFollow = !user.isFollow;
        }
        return user;
      });
    });

    executeFollow({ following_user: username });
    // const [output, loading, error] = useAuthAxios({});
  };

  return (
    <div style={style}>
      <Card size="small" title="Suggestions for you">
        {loading && <div>Loading...</div>}
        {error && <div>Error 발생!!!</div>}
        {!error &&
          userList.map((value, index) => {
            return (
              <Suggestion
                key={index}
                user={value}
                onFollowUser={onFollowUser}
              />
            );
          })}
      </Card>
    </div>
  );
}
