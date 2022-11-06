import React from "react";
import { Avatar } from "antd";
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
          icon={<img src={avatar_url} alt={username} />}
          className="cursor"
        />
      </div>
      <div className="username">
        <div className="cursor">{name.length === 0 ? username : name}</div>{" "}
        <div className="gray">회원님을 팔로우합니다.</div>
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
