import axios from "axios";
import { createDatabaseSession } from "./src/database";
import { parseToriListing, ToriEntry } from "./src/parseTori";
import { EmailDao } from "./src/sendEmails";


const main = async () => {
  const db = await createDatabaseSession();
  const emailDao = new EmailDao(db);
  await emailDao.saveNewItems(
    [
      { url: "https://www.tori.fi/1", title: "asd" },
      { url: "https://www.tori.fi/2", title: "asd" },
      { url: "https://www.tori.fi/3", title: "asd" },
    ],
    1
  );
  // await db.any("SELECT 1");
  // const url = "https://www.tori.fi/uusimaa?ca=18&s=1&w=1";
  // const entries = await fetchEntriesForUrl(url);
  // console.log(entries);
  db.$pool.end();
};

main();
