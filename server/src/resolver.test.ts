import { Server } from "http";
import createServer from "./server";
import { createDbSession } from "./database";

import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { fetchGraphql, teardownServer } from "./testSetup";

let koaServer: Server;
let database: IDatabase<unknown, IClient>;

jest.mock("./authentication.ts", () => {
  // Use sync require here because of jest hoisting behavior
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { fakeVerifyGoogleIdToken } = require("./testSetup");
  return { verifyGoogleIdToken: fakeVerifyGoogleIdToken };
});

beforeAll((done) => {
  database = createDbSession();
  const server = createServer(database);

  // koa.listen doesn't return promise
  koaServer = server.koaApp.listen(2000, () => done());
});

afterAll((done) => teardownServer(koaServer, database, done));

test("Logging in", async () => {
  const loginMutation = `
    mutation {
      loginAttempt
    }
`;

  const { data } = await fetchGraphql(loginMutation);

  expect(data.data.loginAttempt).toBe("ok");
});

test("Fetching user email", async () => {
  const emailQuery = `{
    user {
      email
    }
  }`;
  const { data } = await fetchGraphql(emailQuery);

  expect(data.data.user.email).toBe("testuser@example.com");
});
