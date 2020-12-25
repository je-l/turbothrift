import React from "react";
import TopBar from "./TopBar";
import ToriList from "./toriList";
import ToriSearchInput from "./toriSearchInput";

const FrontPage = () => (
  <div>
    <TopBar />
    <ToriSearchInput />
    <ToriList />
  </div>
);

export default FrontPage;
