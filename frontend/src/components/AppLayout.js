import React, { useEffect } from "react";

import "./AppLayout.scss";
import { Input, Menu } from "antd";

import LogoImage from "assets/logo.png";
import { useAppContext, deleteToken } from "appStore";
import { useNavigate } from "react-router-dom";

function Root({ children, sidebar }) {
  const {
    store: { username },
    dispatch,
  } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="app ">
      <div className="header">
        <h1 className="page-title">
          <img src={LogoImage} alt={"logo"} />
        </h1>
        <div className="search">
          <Input.Search placeholder="" />
        </div>
        <div className="topnav">
          <Menu
            style={{ width: "270px" }}
            mode="horizontal"
            // forceSubMenuRender={true}
            items={[
              { label: " 프로필", key: "profile" }, // remember to pass the key prop
              { label: "프로필 수정", key: "edit-profile" }, // which is required
              { label: "로그아웃", key: "logout" }, // which is required
            ]}
            onClick={({ key }) => {
              // console.log(key);
              if (key === "logout") {
                dispatch(deleteToken());
              } else if (key === "profile") {
                navigate(`/accounts/profile/${username}/`);
              } else if (key === "edit-profile") {
              }
            }}
          />
        </div>
      </div>

      <div className="contents">{children}</div>
      <div className="sidebar">{sidebar}</div>

      <div className="footer">&copy; 2022. imaginary84.</div>
    </div>
  );
}

export default Root;
