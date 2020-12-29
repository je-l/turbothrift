import React, { useEffect } from "react";
import ReactDom from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useReactiveVar,
  gql,
  useQuery,
} from "@apollo/client";
import FrontPage from "./FrontPage";
import { setContext } from "@apollo/client/link/context";

import "./global.css";
import SignInPage from "./SignInPage";
import { isSignedIn } from "./apolloCache";

const authLink = setContext(async (_, { headers }) => {
  const user = getCurrentUser();
  const token = user.isSignedIn() ? user.getAuthResponse().id_token : null;

  return {
    headers: {
      ...headers,
      authorization: token ? "bearer " + token : "",
    },
  };
});

const httpLink = createHttpLink({ uri: "http://localhost:4000" });

const getCurrentUser = () => {
  const auth = gapi.auth2.getAuthInstance();
  return auth.currentUser.get();
};

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

/**
 * Load gapi.auth2 library before rendering app
 */
gapi.load("auth2", async () => {
  // @ts-ignore
  await gapi.auth2.init({ client_id: process.env.GOOGLE_CLIENT_ID });

  ReactDom.render(
    <ApolloProvider client={apolloClient}>
      <AppRoot />
    </ApolloProvider>,
    document.querySelector("div#app")
  );
});

const AppRoot = () => {
  const loggedIn = useReactiveVar(isSignedIn);

  useEffect(() => {
    const user = getCurrentUser();
    if (user.isSignedIn() != loggedIn) {
      isSignedIn(!loggedIn);
    }
  }, []);

  if (loggedIn) {
    return <FrontPage />;
  } else {
    return <SignInPage />;
  }
};
