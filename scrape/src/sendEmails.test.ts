import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";
import { createDatabaseSession } from "./database";
import { ToriEntry } from "./parseTori";
import { EmailDao } from "./sendEmails";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let db: IDatabase<any, IClient> = null;

beforeAll(async () => {
  db = await createDatabaseSession();
});

test("adding new Tori entries", async () => {
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
      'haun otsikko',
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

  // One old item, two new items for insertion.
  const newItems: ToriEntry[] = [
    { title: "Rossin adventure 56cm", url: "https://www.tori.fi/1" },
    { title: "Bridgestone NJS runko", url: "https://www.tori.fi/2" },
    { title: "Makino track", url: "https://www.tori.fi/3" },
  ];

  const emailDao = new EmailDao(db);

  const newIds = await emailDao.saveNewItems(newItems, toriquery.id);

  expect(newIds.length).toBe(2);
  const newItemsInDb = await db.many("SELECT item_url FROM toriitem");

  expect(newItemsInDb.map((i) => i.item_url)).toEqual([
    "https://www.tori.fi/1",
    "https://www.tori.fi/2",
    "https://www.tori.fi/3",
  ]);
});

afterAll(async () => {
  await db.$pool.end();
});
