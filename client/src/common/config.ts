import { gql } from "@apollo/client";

export const FETCH_CONFIG = gql`
  query {
    configuration {
      googleClientId
    }
  }
`;

export interface FetchConfigurationResponse {
  configuration: { googleClientId: string };
}
