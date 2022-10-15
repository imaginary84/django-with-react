import React from "react";
import { Card } from "antd";
import "./StoryList.scss";

export default function StoryList({ style }) {
  // const { style } = props;
  return (
    <div style={style}>
      <Card size="small" title="Stories">
        Stories from people you follow will show up here.
        <p>StoryList 1</p>
        <p>StoryList 2</p>
        <p>StoryList 3</p>
      </Card>
    </div>
  );
}
