import createServer from "./server";
import { createDbSession } from "./database";

const db = createDbSession();
const { koaApp } = createServer(db);

koaApp.listen({ port: 4000 }, () => console.log("ready"));
