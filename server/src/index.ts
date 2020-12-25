import { readFileSync } from "fs";
import camelcaseKeys from "camelcase-keys";
import { ApolloServer, gql } from "apollo-server";
import pgPromise from "pg-promise";

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

const resolvers = {
  Query: {
    allToriQueries: async () => {
      console.log("alltoriqueriees");
      const items = await db.manyOrNone("SELECT * FROM toriquery");
      console.log("items");
      console.log(items);
      return camelcaseKeys(items);
    },
  },
  Mutation: {
    addToriQuery: async (root, args) => {
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

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => console.log("apollo server started: " + url))
  .catch((e) => console.error(e));
