import React, { useState, useReducer, createContext, useContext } from "react";
import "App.scss";
import PostList from "PostList";

function App() {
  return (
    <div>
      Hello, World.
      <PostList />
    </div>
  );
}

export default App;
