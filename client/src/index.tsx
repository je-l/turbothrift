import React from "react";
import ReactDom from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useReactiveVar,
} from "@apollo/client";
import FrontPage from "./FrontPage";
import { setContext } from "@apollo/client/link/context";

import "./global.css";
import SignInPage from "./SignInPage";
import { userTokenCache } from "./apolloCache";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? "bearer " + token : "",
    },
  };
});

const httpLink = createHttpLink({ uri: "http://localhost:4000" });

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

const AppRoot = () => {
  const token = useReactiveVar(userTokenCache);

  if (!token) {
    return <SignInPage />;
  } else {
    return <FrontPage />;
  }
};

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <AppRoot />
  </ApolloProvider>,
  document.querySelector("div#app")
);
