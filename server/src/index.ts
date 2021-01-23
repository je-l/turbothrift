import koa, { Context } from "koa";
import cors from "@koa/cors";
import koaRouter from "koa-router";
import { ApolloServer } from "apollo-server-koa";
import { readFileSync } from "fs";
import { gql } from "apollo-server";
import { createDbSession } from "./database";
import { verifyGoogleIdToken } from "./authentication";
import { createResolvers } from "./toriResolvers";

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const db = createDbSession();

const app = new koa();
app.use(cors({ credentials: true }));
const router = new koaRouter();

const server = new ApolloServer({
  formatError: (err) => {
    console.error(err);
    console.log(JSON.stringify(err));
    console.log(err.extensions!.exception.stacktrace);
    return err;
  },
  typeDefs: gql(toriItemSchema),
  resolvers: createResolvers(db),
  context: async ({ ctx }) => {
    const token = ctx.header.authorization;

    if (!token) {
      console.log("token missing");
      return { ...ctx, user: null };
    }

    const user = await verifyGoogleIdToken(token.replace("bearer ", ""));

    return { ...ctx, user };
  },
});
app.use(router.routes());
app.use(router.allowedMethods());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log("ready"));
