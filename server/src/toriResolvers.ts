import { IResolvers } from "apollo-server";
import { AuthenticationError } from "apollo-server-koa";
import camelcaseKeys from "camelcase-keys";
import { IDatabase } from "pg-promise";
import { env } from "process";
import { Context, User } from "./toriItem";

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("google client id missing");
}

export const createResolvers = (
  db: IDatabase<unknown>
): IResolvers<any, Context> => {
  return {
    User: {
      searchQueries: async (parentUser: User) => {
        return await db.manyOrNone(
          "SELECT * FROM toriquery WHERE app_user = $[userId]",
          { userId: parentUser.id }
        );
      },
    },
    Query: {
      user: async (_, args, { user }) => {
        if (!user) {
          throw new AuthenticationError("Bearer token missing");
        }
        const createdUser = await db.one(
          "SELECT * FROM app_user WHERE email = $[email]",
          { email: user.email }
        );

        return createdUser;
      },
      allToriQueries: async () => {
        const items = await db.manyOrNone("SELECT * FROM toriquery");
        return camelcaseKeys(items);
      },
      configuration: async () => {
        return {
          googleClientId: GOOGLE_CLIENT_ID,
        };
      },
    },
    Mutation: {
      addToriQuery: async (_, args, ctx) => {
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
      loginAttempt: async (_, args, ctx: Context) => {
        const email = ctx.user.email;
        await db.none(
          `INSERT INTO app_user (email)
          VALUES ($[email])
          ON CONFLICT (email) DO NOTHING`,
          {
            email,
          }
        );
        return "ok";
      },
    },
  };
};
