import React, { useEffect, useRef, useState } from "react";
import "./TagForm.scss";
import { CloseOutlined, TagsOutlined } from "@ant-design/icons";

export const TagForm = () => {
  const [tagList, setTagList] = useState([]);
  const [input, setInput] = useState("");
  const [remain, setRemain] = useState(10);

  const inputRef = useRef();

  const handleInputKeyUp = (e) => {
    if (e.key === "Enter" && inputRef.current.value) {
      if (inputRef.current.value.indexOf(",") >= 0) {
        [...new Set(inputRef.current.value.split(","))].forEach((element) => {
          if (element && tagList.indexOf(element) < 0) {
            setTagList((prev) => [...prev, element]);
            setRemain((prev) => prev - 1);
          }
        });
      } else {
        if (tagList.indexOf(inputRef.current.value) < 0) {
          setTagList((prev) => [...prev, inputRef.current.value]);
          setRemain((prev) => prev - 1);
        }
      }
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(inputRef.current.value);
  };

  const handleDeleteClick = (deleteTag) => {
    setTagList((prevList) => {
      return prevList.filter((item) => item !== deleteTag);
    });

    setRemain((prev) => prev + 1);
    inputRef.current.focus();
  };

  const handleRemoveAll = () => {
    setTagList([]);
    setRemain(10);
  };

  useEffect(() => {
    if (remain === 0) {
      inputRef.current.style.display = "none";
    } else {
      inputRef.current.style.display = "inline";
    }
  }, [remain]);

  return (
    <div className="layout">
      <div className="wrapper">
        <div className="title">
          <h2>
            <TagsOutlined />
            Tags
          </h2>
        </div>
        <div className="content">
          <p>Press enter or add a comma after each tag</p>
          <div className="tag-box">
            <ul>
              {tagList &&
                tagList.map((tag) => (
                  <li key={tag}>
                    {tag}
                    <span
                      onClick={() => {
                        handleDeleteClick(tag);
                      }}
                    >
                      <CloseOutlined />
                    </span>
                  </li>
                ))}
              <input
                type="text"
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyUp={handleInputKeyUp}
              />
            </ul>
          </div>
        </div>
        <div className="details">
          <p>
            <span>{remain}</span> tags are remaining
          </p>
          <button onClick={handleRemoveAll}>Remove All</button>
        </div>
      </div>
    </div>
  );
};
