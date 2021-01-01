import axios from "axios";
import { createDatabaseSession } from "./src/database";
import { parseToriListing, ToriEntry } from "./src/parseTori";
import { EmailDao, sendEmailsForUser } from "./src/sendEmails";
import pMapSeries from "p-map-series";

const formatMessage = (insertedItems: ToriEntry[]): string => {
  return insertedItems.map((item) => `${item.title}\n${item.url}`).join("\n\n");
};

const main = async () => {
  const db = await createDatabaseSession();
  const emailDao = new EmailDao(db);
  const queries = await emailDao.fetchAllQueries();

  await pMapSeries(queries, async (query) => {
    const { data } = await axios.get(query.url);
    const currentItems = parseToriListing(data);
    const savedNewItems = await emailDao.saveNewItems(currentItems, query.id);
    const email = await emailDao.emailForId(query.appUser);
    // TODO: implement DAO method
    const message = formatMessage(savedNewItems);
    await sendEmailsForUser(email, message);
  });
  db.$pool.end();
};

main();
