import { gql, useApolloClient, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { GoogleLogout } from "react-google-login";
import { isSignedIn } from "./apolloCache";

const TopBracket = styled.div`
  display: flex;

  width: 100%;
`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("client id missing");
}


const LogOutButton = styled(GoogleLogout)`
  margin: 10px 10px 0 auto;

  cursor: pointer;
`;

const TopBar = () => {
  const apollo = useApolloClient();

  const logOut = async () => {
    apollo.clearStore();
    isSignedIn(false);
    console.log("sucessfully logged out");
  };

  return (
    <TopBracket>
      <LogOutButton
        buttonText="Log out"
        clientId={GOOGLE_CLIENT_ID}
        onLogoutSuccess={logOut}
        onFailure={() => console.error("failed to log out")}
      >
        Log out
      </LogOutButton>
    </TopBracket>
  );
};

export default TopBar;
