import { useApolloClient, useQuery } from "@apollo/client";
import React from "react";
import styled from "styled-components";
import { GoogleLogout } from "react-google-login";

import { isSignedIn } from "./apolloCache";
import { FetchConfigurationResponse, FETCH_CONFIG } from "./common/config";

const TopBracket = styled.div`
  display: flex;

  width: 100%;
`;

const LogOutButton = styled(GoogleLogout)`
  margin: 10px 10px 0 auto;

  cursor: pointer;
`;

const TopBar = () => {
  const apollo = useApolloClient();
  const { loading, data } = useQuery<FetchConfigurationResponse>(FETCH_CONFIG);

  if (loading) {
    return <p>loading config...</p>;
  }

  const logOut = async () => {
    apollo.clearStore();
    isSignedIn(false);
  };

  return (
    <TopBracket>
      <LogOutButton
        buttonText="Log out"
        clientId={data!.configuration.googleClientId}
        onLogoutSuccess={logOut}
        onFailure={() => console.error("failed to log out")}
      >
        Log out
      </LogOutButton>
    </TopBracket>
  );
};

export default TopBar;
