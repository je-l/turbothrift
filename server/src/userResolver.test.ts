import { Server } from "http";
import createServer from "./server";
import { createDbSession } from "./database";

import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { fetchGraphql, teardownServer } from "./testSetup";

let koaServer: Server;
let database: IDatabase<unknown, IClient>;

beforeAll((done) => {
  database = createDbSession();
  const server = createServer(database);
  koaServer = server.koaApp.listen(2000, () => done());
});

afterAll((done) => teardownServer(koaServer, database, done));

test("Fetching user email without logging in", async () => {
  const emailQuery = `{
    user {
      email
    }
  }`;

  const { data } = await fetchGraphql(emailQuery);
  expect(data.data).toBeNull();
});
