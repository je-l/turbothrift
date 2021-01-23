import { gql, useMutation } from "@apollo/client";
import React from "react";
import { GoogleLogin } from "react-google-login";

import { isSignedIn } from "./apolloCache";
import { MainColumn, MainRow } from "./common/pageLayout";
import { config } from "./config";

const LOGIN_ATTEMPT = gql`
  mutation {
    loginAttempt
  }
`;

interface LoginattemptResponse {
  loginAttempt: string;
}

const SignInPage = () => {
  const [doLogin] = useMutation<LoginattemptResponse>(LOGIN_ATTEMPT);

  return (
    <MainRow>
      <MainColumn>
        <h1>Turbothrift</h1>
        <p>
          Turbothrift is a tool for advanced{" "}
          <a href="https://tori.fi">tori.fi</a> users. It provides real-time
          notifications for the search watch (hakuvahti) instead of daily
          alerts.
        </p>
        <GoogleLogin
          clientId={config.GOOGLE_CLIENT_ID}
          accessType="offline"
          prompt="consent"
          onSuccess={async () => {
            await doLogin();
            isSignedIn(true);
          }}
          onFailure={(e) => console.error("error logging in", e)}
        />
      </MainColumn>
    </MainRow>
  );
};

export default SignInPage;
