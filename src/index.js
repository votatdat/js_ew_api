import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';

import noteResolver from './resolvers/noteResolver.js';
import noteSchema from './schemas/noteSchema.js';
import noteModel from './models/noteModel.js';
import connectDB from './db.js';

dotenv.config();

const port = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Connect to the database
connectDB(MONGO_URI);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs: noteSchema,
  resolvers: noteResolver,
  context: () => {
    return { noteModel };
  }
});
// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
