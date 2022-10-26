import React, { useEffect } from "react";
import { Avatar, Button, Card, Input } from "antd";
import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import Axios from "axios";
import { useAppContext, addFunc } from "appStore";
import { useFetch } from "utils/useFetch";
import CommentList from "./CommentList";

const Post = ({ post, handleLike }) => {
  const {
    photo,
    caption,
    location,
    tag_set,
    is_like,
    author: { id: authorId, name, username, avatar_url },
  } = post;

  // const [commentList, setCommentList] = useState([]);
  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchCommet = async () => {
  //     try {
  //       //
  //       setLoading(true);
  //       const headers = { Authorization: `Bearer ${access}` };
  //       const response = await Axios({
  //         method: "GET",
  //         url: `http://localhost:8000/api/posts/${post.id}/comments/`,
  //         headers,
  //       });
  //       setCommentList(response.data);

  //       setLoading(false);
  //     } catch (error) {
  //       //
  //       setError(false);
  //       setLoading(false);
  //     }
  //   };
  //   fetchCommet();
  // }, []);

  return (
    <div>
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
                <img
                  src={"http://localhost:8000" + avatar_url}
                  alt={username}
                />
              }
            />
          }
          title={location}
          description={caption}
          style={{ marginBottom: "0.5em" }}
        />
        <hr />
        <CommentList post={post} />
      </Card>
    </div>
  );
};

export default Post;
