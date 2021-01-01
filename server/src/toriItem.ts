import { TokenPayload } from "google-auth-library";

export interface ToriSearch {
  id: string;
  title: string;
  url: string;
}

export interface User {
  id: string;
  email: string;
  searchQueries: ToriSearch[];
}

export interface Context {
  user: TokenPayload;
}
