import React from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

function Root(props) {
  const { children } = props;

  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}

export default Root;
