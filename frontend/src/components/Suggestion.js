import React from "react";
import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Suggestion.scss";

export default function Suggestion(props) {
  const {
    user: { username, name, avatar_url, isFollow },
    onFollowUser,
  } = props;
  return (
    <div className="suggestion">
      <div className="avatar">
        <Avatar
          size={"large"}
          icon={
            <img src={"http://localhost:8000" + avatar_url} alt={username} />
          }
          className="cursor"
        />
      </div>
      <div className="username">
        <div className="cursor">{name.length === 0 ? username : name}</div>{" "}
        <span className="gray">회원님을 팔로우합니다.</span>
      </div>
      <div className="action">
        {isFollow && "팔로윙 중"}
        {!isFollow && (
          <span
            className="follow cursor"
            onClick={() => onFollowUser(username)}
          >
            Follow
          </span>
        )}
      </div>
    </div>
  );
}
