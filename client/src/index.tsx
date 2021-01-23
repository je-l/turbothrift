import React, { useEffect } from "react";
import ReactDom from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useReactiveVar,
  createHttpLink,
} from "@apollo/client";
import FrontPage from "./FrontPage";

import "./global.css";
import SignInPage from "./SignInPage";
import { isSignedIn } from "./apolloCache";
import { authorizationLink, getCurrentUser } from "./authentication";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authorizationLink.concat(httpLink),
});

const AuthenticationCheck = () => {
  const loggedIn = useReactiveVar(isSignedIn);

  useEffect(() => {
    const user = getCurrentUser();
    if (user.isSignedIn()) {
      isSignedIn(true);
    }
  }, []);
  if (loggedIn) {
    return <FrontPage />;
  } else {
    return <SignInPage />;
  }
};

gapi.load("auth2", () => {
  // async/await not supported by gapi
  gapi.auth2.init({ client_id: process.env.GOOGLE_CLIENT_ID }).then(() => {
    ReactDom.render(
      <ApolloProvider client={apolloClient}>
        <AuthenticationCheck />
      </ApolloProvider>,
      document.querySelector("div#app")
    );
  });
});
