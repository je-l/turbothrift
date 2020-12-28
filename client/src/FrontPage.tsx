import React from "react";
import { MainColumn, MainRow } from "./common/pageLayout";
import TopBar from "./TopBar";
import ToriList from "./toriList";
import ToriSearchForm from "./toriSearchForm";

const FrontPage = () => (
  <>
    <TopBar />
    <MainRow>
      <MainColumn>
        <ToriSearchForm />
        <ToriList />
      </MainColumn>
    </MainRow>
  </>
);

export default FrontPage;
