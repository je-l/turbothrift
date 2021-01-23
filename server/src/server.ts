import koa from "koa";
import cors from "@koa/cors";
import koaRouter from "koa-router";
import { ApolloServer } from "apollo-server-koa";
import { readFileSync } from "fs";
import { gql } from "apollo-server";
import { verifyGoogleIdToken } from "./authentication";
import { createResolvers } from "./toriResolvers";
import { IDatabase } from "pg-promise";
import { IClient } from "pg-promise/typescript/pg-subset";

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const createServer = (db: IDatabase<unknown, IClient>) => {
  const koaApp = new koa();
  koaApp.use(cors({ credentials: true }));
  const router = new koaRouter();

  const apolloServer = new ApolloServer({
    formatError: (err) => {
      console.error(err);
      console.log(JSON.stringify(err));
      console.log(err.extensions!.exception.stacktrace);
      return err;
    },
    typeDefs: gql(toriItemSchema),
    resolvers: createResolvers(db),
    context: async ({ ctx }) => {
      const user = await verifyGoogleIdToken(ctx.header);

      return { ...ctx, user };
    },
  });
  koaApp.use(router.routes());
  koaApp.use(router.allowedMethods());

  apolloServer.applyMiddleware({ app: koaApp });

  return { apolloServer, koaApp };
};

export default createServer;
