import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { submitForm } from "./toriList.duck";

const SearchInput = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SearchContainer = styled.div`
  margin: 15px;
`;

const ADD_TORI_QUERY = gql`
  mutation($url: String!) {
    addToriQuery(url: $url)
  }
`;

const ToriSearchInput = () => {
  const [titleValue, setTitleValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [addToriQuery] = useMutation(ADD_TORI_QUERY);
  const dispatch = useDispatch();

  const submitting = (e: FormEvent) => {
    e.preventDefault();
    addToriQuery({ variables: { url: urlValue, title: titleValue } });
    dispatch(submitForm(titleValue, urlValue));
  };

  return (
    <form onSubmit={submitting}>
      <SearchContainer>
        Please provide a title
        <SearchInput>
          <input
            value={titleValue}
            onChange={(e) => setTitleValue(e.currentTarget.value)}
          />
        </SearchInput>
      </SearchContainer>
      <SearchContainer>
        Please provide tori.fi search URL
        <SearchInput>
          <input
            value={urlValue}
            onChange={(e) => setUrlValue(e.currentTarget.value)}
          />
        </SearchInput>
        <button>submit</button>
      </SearchContainer>
    </form>
  );
};

export default ToriSearchInput;
