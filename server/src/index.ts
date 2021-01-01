import { readFileSync } from "fs";
import camelcaseKeys from "camelcase-keys";
import { ApolloServer, AuthenticationError, gql } from "apollo-server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "process";
import { Context, User } from "./toriItem";
import { createDbSession } from "./database";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("google client id missing");
}

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const db = createDbSession();

const googleAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const resolvers = {
  User: {
    searchQueries: async (parentUser: User) => {
      const searches = await db.manyOrNone(
        "SELECT * FROM toriquery WHERE app_user = $[userId]",
        { userId: parentUser.id }
      );

      return searches;
    },
  },
  Query: {
    user: async (_: undefined, args: unknown, ctx: Context) => {
      const user = await db.one(
        "SELECT * FROM app_user WHERE email = $[email]",
        { email: ctx.user.email }
      );

      return user;
    },
    allToriQueries: async () => {
      const items = await db.manyOrNone("SELECT * FROM toriquery");
      return camelcaseKeys(items);
    },
  },
  Mutation: {
    addToriQuery: async (_: undefined, args: any, ctx: Context) => {
      const { id: userId } = await db.one(
        "SELECT id FROM app_user WHERE email = $[email]",
        {
          email: ctx.user.email,
        }
      );

      await db.any(
        `INSERT INTO ToriQuery (
            title,
            url,
            app_user
          ) VALUES (
            $[title],
            $[url],
            $[userId]
          )`,
        { title: args.title, url: args.url, userId }
      );
      console.log("inserted new toriquery element:");
      console.log(args);
      return "ok";
    },
    loginAttempt: async (_: undefined, args: any, ctx: Context) => {
      await db.none(
        `INSERT INTO app_user (email)
        VALUES ($[email])
        ON CONFLICT (email) DO NOTHING`,
        {
          email: ctx.user.email,
        }
      );

      return "ok";
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
    throw new AuthenticationError("no payload");
  }

  return payload;
};

const server = new ApolloServer({
  formatError: (err) => {
    console.error(err);
    return err;
  },
  typeDefs: gql(toriItemSchema),
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;

    if (!token) {
      console.log("token missing");
      throw new AuthenticationError("token missing from headers");
    }

    const user = await getUser(token.replace("bearer ", ""));

    return { user };
  },
});

server
  .listen()
  .then(({ url }) => console.log("apollo server started: " + url))
  .catch((e) => console.error(e));
