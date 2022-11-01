import React from "react";
import { Avatar, Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function MiniProfile({ profile }) {
  const navigate = useNavigate();

  const { avatar_url, username, name } = profile;

  return (
    <Card.Meta
      avatar={
        <Avatar
          size="large"
          icon={
            <img src={"http://localhost:8000" + avatar_url} alt={username} />
          }
        />
      }
      title={username}
      description={name}
      style={{ marginBottom: "0.5em", cursor: "pointer" }}
      onClick={() => {
        navigate(`/accounts/profile/${username}/`);
      }}
    />
  );
}
