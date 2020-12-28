import { useApolloClient, useReactiveVar } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { userTokenCache } from "./apolloCache";
import jwtDecode from "jwt-decode";

const TopBracket = styled.div`
  display: flex;

  width: 100%;
`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("client id missing");
}

const LogOutButton = styled.div`
  padding: 13px;
  margin-left: auto;

  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
`;

const TopBar = () => {
  const userToken = useReactiveVar(userTokenCache);
  const parsedToken = jwtDecode<{ given_name: string }>(userToken!);
  const apollo = useApolloClient();

  const logOut = () => {
    localStorage.removeItem("token");
    userTokenCache(null);
    apollo.clearStore();
  };

  return (
    <TopBracket>
      <LogOutButton onClick={logOut}>
        Log out ({parsedToken.given_name})
      </LogOutButton>
    </TopBracket>
  );
};

export default TopBar;
