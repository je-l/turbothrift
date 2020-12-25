import React from "react";
import ReactDom from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import FrontPage from "./FrontPage";
import { Provider } from "react-redux";
import reducers from "./toriList.duck";

import "./global.css";
import { createStore } from "redux";

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const store = createStore(reducers);

ReactDom.render(
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <FrontPage />
    </Provider>
  </ApolloProvider>,
  document.querySelector("div#app")
);
