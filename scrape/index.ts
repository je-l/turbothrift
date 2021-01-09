import { main } from "./scrape";
import { createDatabaseSession } from "./src/database";

const run = async () => {
  const db = await createDatabaseSession();

  await main(db);

  await db.$pool.end();
};

run();
