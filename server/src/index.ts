import { ApolloServer, gql } from 'apollo-server';
import mockToriPosts from './toriFixture.json';
import { readFileSync } from 'fs';

const toriItemSchema = readFileSync('./src/toriListingSchema.graphql').toString();

const typeDefs = gql(toriItemSchema);

const resolvers = {
  Query: {
    allToriItems: () => mockToriPosts,
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(() => console.log('apollo server started'))
