import axios from "axios";
import { Server } from "http";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { verifyGoogleIdToken } from "./authentication";

export const fakeVerifyGoogleIdToken: typeof verifyGoogleIdToken = (_) => {
  return Promise.resolve({
    iss: "moi",
    aud: "moi",
    sub: "moi",
    iat: 1,
    exp: 1,
    email: "testuser@example.com",
  });
};

export const teardownServer = (
  koaServer: Server,
  db: IDatabase<unknown, IClient>,
  done: () => unknown
) => {
  koaServer.close((err) => {
    if (err) {
      console.error(err);
    }

    db.$pool
      .end()
      .then(() => {
        done();
      })
      .catch((err) => console.error(err));
  });
};

export const fetchGraphql = (query: string) =>
  axios.post("http://localhost:2000/graphql", { query });
