import { gql, useMutation } from "@apollo/client";
import React from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { userTokenCache } from "./apolloCache";
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

  const token = args.getAuthResponse().id_token;
  return token;
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
          onSuccess={async (...args) => {
            const token = signIn(...args);
            localStorage.setItem("token", token);
            await doLogin();
            userTokenCache(token);
          }}
        />
      </MainColumn>
    </MainRow>
  );
};

export default SignInPage;
