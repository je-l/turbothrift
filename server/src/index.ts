import createServer from "./server";
import { createDbSession } from "./database";
import { env } from "process";

const PORT = env.PORT;

if (!PORT) {
  console.error("PORT missing");
  process.exit(1);
}

const db = createDbSession();
const { koaApp } = createServer(db);

koaApp.listen({ port: PORT }, () => console.log("ready"));
