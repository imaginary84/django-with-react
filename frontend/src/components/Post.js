import React from "react";
import { Avatar, Card } from "antd";
import { HeartOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";

const Post = ({ post }) => {
  const { photo, caption, location } = post;

  return (
    <div>
      <Card
        hoverable
        cover={<img src={photo} alt={caption} />}
        actions={[<HeartOutlined key="like" />, <HeartFilled key="unlike" />]}
      >
        <Card.Meta
          avatar={<Avatar size="large" icon={<UserOutlined />} />}
          title={location}
          description={caption}
        />
      </Card>
    </div>
  );
};

export default Post;
