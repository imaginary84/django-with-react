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
          size={"small"}
          icon={
            <img src={"http://localhost:8000" + avatar_url} alt={username} />
          }
        />
      </div>
      <div className="username">
        {name.length === 0 ? username : name} {/*isFollow ? "True" : "False"*/}
      </div>
      <div className="action">
        {isFollow && "팔로윙 중"}
        {!isFollow && (
          <Button size="small" onClick={() => onFollowUser(username)}>
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}
