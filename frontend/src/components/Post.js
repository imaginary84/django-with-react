import React from "react";
import { Avatar, Card } from "antd";
import { HeartOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";

const Post = ({ post }) => {
  const {
    photo,
    caption,
    location,
    tag_set,
    like_user_set,
    author: { id, name, username, avatar_url },
  } = post;

  return (
    <Card
      hoverable
      cover={<img src={photo} alt={caption} />}
      actions={[<HeartOutlined key="like" />, <HeartFilled key="unlike" />]}
      // title={author_username}
      style={{ marginBottom: "20px" }}
    >
      <Card.Meta
        avatar={
          <Avatar
            size="large"
            icon={
              <img src={"http://localhost:8000" + avatar_url} alt={username} />
            }
          />
        }
        title={location}
        description={caption}
      />
    </Card>
  );
};

export default Post;
