import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';

import connectDB from './db.js';
import models from './models/index.js';

dotenv.config();

const port = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

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
    type Mutation {
        newNote(content: String!): Note!
    }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    notes: () => async () => await models.Note.find(),
    note: async (parent, args) =>
      await models.Note.findById(args.id)
  },
  Mutation: {
    newNote: async (parent, args) => {
      let newNote = {
        content: args.content,
        author: 'new author',
      };
      return await models.Note.create(newNote);
    }
  }

};

const app = express();

// Connect to the database
connectDB(MONGO_URI);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });
// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
