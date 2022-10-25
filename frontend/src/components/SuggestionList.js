import React, { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import Suggestion from "./Suggestion";
import "./SuggestionList.scss";
import Axios from "axios";
import { useAppContext, addFunc } from "appStore";
import { useFetch } from "utils/useFetch";

export default function SuggestionList({ style }) {
  const { store, dispatch } = useAppContext();
  const { access, refresh } = store;
  const headers = useMemo(() => ({ Authorization: `Bearer ${access}` }), []);

  const [originUserList, loading, error, fetchSuggestionList] = useFetch({
    method: "GET",
    url: "http://localhost:8000/accounts/suggestions/",
    headers,
  });

  useEffect(() => {
    fetchSuggestionList();
    dispatch(addFunc("fetchSuggestionList", fetchSuggestionList));
  }, []);

  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [originUserList, setOriginUserList] = useState([]);

  // useEffect(() => {
  //   const postList = async () => {
  //     try {
  //       setLoading(true);

  //       const response = await Axios({
  //         method: "GET",
  //         url: "http://localhost:8000/accounts/suggestions/",
  //         headers,
  //       });
  //       setLoading(false);
  //       setOriginUserList(response.data);
  //     } catch (error) {
  //       setError(true);
  //       setLoading(false);
  //     }
  //   };
  //   postList();
  // }, [headers]);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (!originUserList) setUserList([]);
    else
      setUserList(originUserList.map((user) => ({ ...user, isFollow: false })));
  }, [originUserList]);

  const onFollowUser = (username) => {
    const follow = async () => {
      try {
        const data = { following_user: username };
        const config = { headers };
        await Axios.post(
          "http://localhost:8000/accounts/follow/",
          data,
          config
        );
        //팔로윙중
        // setUserList((prevUserList) => {
        //   return prevUserList.map((user) => {
        //     if (user.username === username) {
        //       user.isFollow = !user.isFollow;
        //     }
        //     return user;
        //   });
        // });

        //팔로우 즉시 사라짐.
        setUserList((prevUserList) => {
          let result = [];
          for (let i = 0; i < prevUserList.length; i++) {
            if (prevUserList[i].username !== username) {
              result.push(prevUserList[i]);
            }
          }
          return result;
        });
      } catch (error) {
        console.log(error);
      }
    };

    follow();
  };

  return (
    <div style={style}>
      <button
        onClick={() => {
          store.funcList.fetchPostList();
        }}
      >
        포스트 조회
      </button>
      <button
        onClick={() => {
          store.funcList.fetchSuggestionList();
        }}
      >
        서제셜 조회
      </button>
      {loading && <div>Loading...</div>}
      {error && <div>로딩 중 에러가 발생했습니다.</div>}
      <Card size="small" title="Suggestions for you">
        {userList.map((value, index) => {
          return (
            <Suggestion key={index} user={value} onFollowUser={onFollowUser} />
          );
        })}
      </Card>
    </div>
  );
}
