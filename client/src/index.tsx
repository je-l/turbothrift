import React from "react";
import ReactDom from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  gql,
} from "@apollo/client";
import FrontPage from "./FrontPage";
import { setContext } from "@apollo/client/link/context";

import "./global.css";
import SignInPage from "./signInPage";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? "bearer " + token : "",
    },
  };
});

const typeDefs = gql`
  extend type Query {
    email: String
  }
`;

const httpLink = createHttpLink({ uri: "http://localhost:4000" });

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  typeDefs,
});

const AppRoot = () => {
  const token = localStorage.getItem("token");

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
