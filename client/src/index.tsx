import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useReactiveVar,
  createHttpLink,
  gql,
  useQuery,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import FrontPage from "./FrontPage";

import "./global.css";
import SignInPage from "./login/SignInPage";
import { isSignedIn } from "./apolloCache";
import { authorizationLink, getCurrentUser } from "./authentication";
import { FetchConfigurationResponse, FETCH_CONFIG } from "./common/config";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((e) => {
      console.error(e);
    });
  }
  if (networkError) console.error(networkError);
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authorizationLink).concat(httpLink),
});

const AuthenticationCheck = () => {
  const loggedIn = useReactiveVar(isSignedIn);

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.isSignedIn()) {
      isSignedIn(true);
    }
  }, []);
  if (loggedIn) {
    return <FrontPage />;
  } else {
    return <SignInPage />;
  }
};

const EnvLoader = () => {
  const { loading: loadingConfig, data } = useQuery<FetchConfigurationResponse>(
    FETCH_CONFIG
  );
  const [loadingGapi, setLoadingGapi] = useState(true);

  useEffect(() => {
    if (loadingConfig) {
      return;
    }

    gapi.load("auth2", () => {
      // async/await not supported by gapi
      gapi.auth2
        .init({ client_id: data!.configuration.googleClientId })
        .then(() => {
          setLoadingGapi(false);
        });
    });
  }, [loadingConfig]);

  if (loadingConfig) {
    return <p>loading config...</p>;
  }

  if (loadingGapi) {
    return <p>loading gapi...</p>;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AuthenticationCheck />
    </ApolloProvider>
  );
};

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <EnvLoader />
  </ApolloProvider>,
  document.querySelector("div#app")
);
