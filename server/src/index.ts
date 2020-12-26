import { readFileSync } from "fs";
import camelcaseKeys from "camelcase-keys";
import { ApolloServer, gql } from "apollo-server";
import pgPromise from "pg-promise";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "process";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("google client id missing");
}

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const pgp = pgPromise({});

const postgresConnectionOptions = {
  username: "postgres",
  host: "database",
  database: "postgres",
  user: "postgres",
  password: "1234",
};

const db = pgp(postgresConnectionOptions);

const typeDefs = gql(toriItemSchema);

const googleAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const resolvers = {
  Query: {
    allToriQueries: async () => {
      const items = await db.manyOrNone("SELECT * FROM toriquery");
      return camelcaseKeys(items);
    },
  },
  Mutation: {
    addToriQuery: async (_: undefined, args: any, ctx: any) => {
      await db.any(
        `INSERT INTO ToriQuery (
            title,
            url
          ) VALUES (
            $[title],
            $[url]
          )`,
        { title: "title", url: args.url }
      );
      console.log("inserted new toriquery element:");
      console.log(args);
      return "test";
    },
  },
};

const getUser = async (token: string): Promise<TokenPayload> => {
  const loginTicket = await googleAuthClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = loginTicket.getPayload();

  if (!payload) {
    console.error(payload);
    throw new Error("no payload");
  }

  return payload;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;

    if (!token) {
      return { user: null };
    }

    const user = await getUser(token.replace("bearer ", ""));

    return { user };
  },
});

server
  .listen()
  .then(({ url }) => console.log("apollo server started: " + url))
  .catch((e) => console.error(e));
