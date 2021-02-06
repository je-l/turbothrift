import { gql } from "@apollo/client";

export const LOGIN_ATTEMPT = gql`
  mutation {
    loginAttempt
  }
`;

export interface LoginattemptResponse {
  loginAttempt: string;
}
