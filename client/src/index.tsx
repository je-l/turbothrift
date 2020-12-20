import React from "react";
import ReactDom from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ToriList from "./toriList";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <ToriList />
  </ApolloProvider>,
  document.querySelector("div#app")
);
