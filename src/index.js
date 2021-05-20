import express from "express";
import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server-express";

dotenv.config();

const port = process.env.PORT || 4000;

// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    type Query {
        hello: String
    }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => "Hello World!"
  }
};

const app = express();

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });
// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: "/api" });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
