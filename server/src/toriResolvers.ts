import { IResolvers } from "apollo-server";
import camelcaseKeys from "camelcase-keys";
import { IDatabase } from "pg-promise";
import { Context, User } from "./toriItem";

/**
 *
 */
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
      user: async (_, args, ctx) => {
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
      loginAttempt: async (_, args, ctx) => {
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
};
