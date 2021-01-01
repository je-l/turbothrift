import { readFileSync } from "fs";
import { ApolloServer, AuthenticationError, gql } from "apollo-server";
import { createDbSession } from "./database";
import { verifyGoogleIdToken } from "./authentication";
import { createResolvers } from "./toriResolvers";

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const db = createDbSession();

const server = new ApolloServer({
  formatError: (err) => {
    console.error(err);
    return err;
  },
  typeDefs: gql(toriItemSchema),
  resolvers: createResolvers(db),
  context: async ({ req }) => {
    const token = req.headers.authorization;

    if (!token) {
      console.log("token missing");
      throw new AuthenticationError("token missing from headers");
    }

    const user = await verifyGoogleIdToken(token.replace("bearer ", ""));

    return { user };
  },
});

server
  .listen()
  .then(({ url }) => console.log("apollo server started: " + url))
  .catch((e) => console.error(e));
