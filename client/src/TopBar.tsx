import React from "react";
import styled from "styled-components";

const TopBracket = styled.div`
  display: flex;

  width: 100%;

  background-color: lightgray;
`;

const SignInButton = styled.div`
  margin: 15px 15px 15px auto;

  border-radius: 999px;

  cursor: pointer;
`;

const TopBar = () => (
  <TopBracket>
    <SignInButton>Sign in</SignInButton>
  </TopBracket>
);

export default TopBar;
