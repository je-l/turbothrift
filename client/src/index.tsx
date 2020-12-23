import React from "react";
import ReactDom from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ToriList from "./toriList";
import FrontPage from "./FrontPage";

import "./global.css";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <FrontPage />
  </ApolloProvider>,
  document.querySelector("div#app")
);
