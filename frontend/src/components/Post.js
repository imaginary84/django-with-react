import React from "react";
import { Avatar, Card } from "antd";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";

const Post = ({ post, handleLike }) => {
  const {
    photo,
    caption,
    location,
    tag_set,
    is_like,
    author: { id, name, username, avatar_url },
  } = post;

  return (
    <Card
      hoverable
      cover={<img src={photo} alt={caption} />}
      actions={[
        is_like ? (
          <HeartTwoTone
            twoToneColor={"#eb2f96"}
            key="unlike"
            onClick={() => handleLike({ post, is_like: false })}
          />
        ) : (
          <HeartOutlined
            key="like"
            onClick={() => handleLike({ post, is_like: true })}
          />
        ),
      ]} //, ]}
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
