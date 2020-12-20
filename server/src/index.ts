import { readFileSync } from "fs";
import { ApolloServer, gql } from "apollo-server";
import mockToriPosts from "./toriFixture.json";

const toriItemSchema = readFileSync(
  "./src/toriListingSchema.graphql"
).toString();

const typeDefs = gql(toriItemSchema);

const resolvers = {
  Query: {
    allToriItems: () => mockToriPosts,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log("apollo server started: " + url));
