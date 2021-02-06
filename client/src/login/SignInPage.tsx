import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { GoogleLogin } from "react-google-login";

import { isSignedIn } from "../apolloCache";
import { FetchConfigurationResponse, FETCH_CONFIG } from "../common/config";
import { MainColumn, MainRow } from "../common/pageLayout";
import { LoginattemptResponse, LOGIN_ATTEMPT } from "./loginQuery";

const SignInPage = () => {
  const [doLogin] = useMutation<LoginattemptResponse>(LOGIN_ATTEMPT);
  const { data, loading } = useQuery<FetchConfigurationResponse>(FETCH_CONFIG, {
    errorPolicy: "ignore",
  });

  if (loading) {
    return <p>loading configuration...</p>;
  }

  return (
    <MainRow>
      <MainColumn>
        <header>
          <h1>Turbothrift</h1>
        </header>
        <main>
          {/* eslint-disable-next-line max-len */}
          <p>
            Turbothrift is a tool for advanced{" "}
            <a href="https://tori.fi">tori.fi</a> users. It provides real-time
            notifications for the search watch (hakuvahti) instead of daily
            alerts.
          </p>
          <GoogleLogin
            clientId={data!.configuration.googleClientId}
            accessType="offline"
            prompt="consent"
            onSuccess={async () => {
              await doLogin();
              isSignedIn(true);
            }}
            onFailure={(e) => console.error("error logging in", e)}
          />
        </main>
      </MainColumn>
    </MainRow>
  );
};

export default SignInPage;
