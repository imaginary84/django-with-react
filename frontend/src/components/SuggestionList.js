import React from "react";
import { Card } from "antd";
import Suggestion from "./Suggestion";
import "./SuggestionList.scss";

export default function SuggestionList({ style }) {
  return (
    <div style={style}>
      <Card size="small" title="Suggestions for you">
        <Suggestion />
        <Suggestion />
        <Suggestion />
      </Card>
    </div>
  );
}
