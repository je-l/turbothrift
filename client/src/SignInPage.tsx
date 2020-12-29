import { gql, useMutation } from "@apollo/client";
import React from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { isSignedIn } from "./apolloCache";
import { MainColumn, MainRow } from "./common/pageLayout";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("client id missing");
}

const signIn = (args: GoogleLoginResponse | GoogleLoginResponseOffline) => {
  if (!("getAuthResponse" in args)) {
    console.error(args);
    throw new Error("failed to login");
  }
};

const LOGIN_ATTEMPT = gql`
  mutation {
    loginAttempt
  }
`;

const SignInPage = () => {
  const [doLogin] = useMutation(LOGIN_ATTEMPT);

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
          clientId={GOOGLE_CLIENT_ID}
          // always ask which account to use
          prompt="select_account"
          onSuccess={async (...args) => {
            console.log("successfully logged in...");
            signIn(...args);
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
