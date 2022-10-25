import React from "react";

import "./AppLayout.scss";
import { Input, Menu } from "antd";

import LogoImage from "assets/logo.png";
import { useAppContext, deleteToken } from "appStore";

function Root({ children, sidebar }) {
  // const= props;
  const { dispatch } = useAppContext();
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
            mode="horizontal"
            items={[
              { label: "메뉴1", key: "menu-1" },
              { label: "메뉴2", key: "menu-2" },
              { label: "메뉴3", key: "menu-3" },
              // {
              //   label: "sub menu",
              //   key: "sub-menu",
              //   children: [{ label: "item 3", key: "item-3" }],
              // },
            ]}
            onClick={() => {
              dispatch(deleteToken());
            }}
          ></Menu>
        </div>
      </div>

      <div className="contents">{children}</div>
      <div className="sidebar">{sidebar}</div>

      <div className="footer">&copy; 2022. imaginary84.</div>
    </div>
  );
}

export default Root;
