import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { createDatabaseSession } from "./database";
import { ToriItem } from "./parseTori";
import ToriDao from "./toriDao";
import { createMessages } from "../scrape";
import { EmailMesssage } from "./sendEmails";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let db: IDatabase<unknown, IClient> = null;

beforeAll(async () => {
  db = await createDatabaseSession();
});

jest.mock("./toriApi", () => ({
  fetchNewItemsForUrl: () =>
    Promise.resolve([
      { itemUrl: "https://www.tori.fi/12345", title: "Bridgestone" },
      { itemUrl: "https://www.tori.fi/1", title: "Rossin 54 cm" },
    ] as ToriItem[]),
}));

test("functionaltest", async () => {
  await db.none("DELETE FROM toriitem;");
  await db.none("DELETE FROM toriquery;");
  await db.none("DELETE FROM app_user;");

  const { id: userId } = await db.one(
    "INSERT INTO app_user (email) VALUES ('user@example.com') RETURNING id"
  );
  const toriquery = await db.one(
    `INSERT INTO toriquery (
      app_user,
      title,
      url
    ) VALUES (
      $[userId],
      'My turbothrift search',
      'https://www.tori.fi/123'
    ) RETURNING id`,
    { userId }
  );
  await db.none(
    `INSERT INTO toriitem (
      item_url,
      title,
      search_query
    ) VALUES (
      'https://www.tori.fi/1',
      'Rossin 54 cm',
      $[queryId]
    )`,
    { queryId: toriquery.id }
  );

  const messages = await createMessages(db);

  const expected: EmailMesssage[] = [
    {
      to: "user@example.com",
      message:
        "My turbothrift search\n\nBridgestone\nhttps://www.tori.fi/12345",
    },
  ];

  expect(messages).toEqual(expected);
});

afterAll(async () => {
  await db.$pool.end();
});
