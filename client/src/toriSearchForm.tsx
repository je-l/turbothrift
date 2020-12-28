import { gql, useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { FETCH_TORI_QUERIES } from "./toriList";

const SearchInput = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SearchForm = styled.form`
  margin: 40px 0;
`;

const SearchContainer = styled.div`
  margin: 15px 0;
`;

const SearchLabel = styled.div`
  font-size: 14px;
`;

const ADD_TORI_QUERY = gql`
  mutation($url: String!, $title: String!) {
    addToriQuery(url: $url, title: $title)
  }
`;

const ToriSearchForm = () => {
  const [titleValue, setTitleValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [addToriQuery] = useMutation(ADD_TORI_QUERY, {
    refetchQueries: [{ query: FETCH_TORI_QUERIES }],
  });

  const submitting = (e: FormEvent) => {
    e.preventDefault();
    addToriQuery({ variables: { url: urlValue, title: titleValue } });
    setTitleValue("");
    setUrlValue("");
  };

  return (
    <>
      <h3>Welcome to Turbothrift</h3>
      <p>
        Please navigate to tori.fi and make a desired search. Then copy the URL
        from the address bar here.
      </p>
      <SearchForm onSubmit={submitting}>
        <SearchContainer>
          <SearchLabel>Please provide a title</SearchLabel>
          <SearchInput>
            <input
              placeholder="My search"
              value={titleValue}
              onChange={(e) => setTitleValue(e.currentTarget.value)}
            />
          </SearchInput>
        </SearchContainer>
        <SearchContainer>
          <SearchLabel>
            Please provide tori.fi URL address for the given search.
          </SearchLabel>
          <SearchInput>
            <input
              placeholder="https://tori.fi/..."
              value={urlValue}
              onChange={(e) => setUrlValue(e.currentTarget.value)}
            />
          </SearchInput>
          <button>submit</button>
        </SearchContainer>
      </SearchForm>
    </>
  );
};

export default ToriSearchForm;
