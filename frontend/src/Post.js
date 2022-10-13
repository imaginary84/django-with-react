import React from "react";

const Post = ({ post }) => {
  const { photo, caption, location } = post;

  return (
    <div>
      <img src={photo} alt={caption} style={{ width: "200px" }} />
      {caption} - {location}
    </div>
  );
};

export default Post;
