import React from "react";
import styled from "styled-components";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

const TopBracket = styled.div`
  display: flex;

  width: 100%;

  background-color: lightgray;
`;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("client id missing");
}

const signIn = (args: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  if (!("getAuthResponse" in args)) {
    console.error(args);
    throw new Error("failed to login");
  }

  const token = args.getAuthResponse().id_token;

  localStorage.setItem("token", token);
};

const TopBar = () => {
  return (
    <TopBracket>
      <GoogleLogin
        // eslint-disable-next-line max-len
        clientId={GOOGLE_CLIENT_ID}
        onSuccess={signIn}
      />
    </TopBracket>
  );
};

export default TopBar;
