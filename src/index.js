import express from "express";
import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server-express";

dotenv.config();

const port = process.env.PORT || 4000;

let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];

// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => "Hello World!",
    notes: () => notes,
    note: (parent, args) =>
      notes.find(note => note.id === args.id)
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
