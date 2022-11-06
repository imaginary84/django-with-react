import React, { useEffect } from "react";
import { Avatar, Button, Card, Input } from "antd";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import CommentList from "./CommentList";

const Post = ({ post, handleLike }) => {
  const {
    id,
    photo,
    caption,
    location,
    tag_set,
    is_like,
    author: { id: authorId, name, username, avatar_url },
  } = post;

  return (
    <div>
      <Card
        title={
          <div>
            <Avatar
              size="default"
              icon={<img src={avatar_url} alt={username} />}
              style={{ marginRight: "15px" }}
            />
            {username}-{id}
          </div>
        }
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
        <Card.Meta description={caption} style={{ marginBottom: "0.5em" }} />
        <hr />
        <CommentList post={post} />
      </Card>
    </div>
  );
};

export default Post;
