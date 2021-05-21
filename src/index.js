import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';

import noteResolver from './resolvers/noteResolver.js';
import noteSchema from './schemas/noteSchema.js';
import noteModel from './models/noteModel.js';
import userModel from './models/userModel.js';
import connectDB from './db.js';
import getUser from './util/getUser.js';

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
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization;
    // try to retrieve a user with the token
    const user = getUser(token);
    // for now, let's log the user to the console:
    return { noteModel, userModel, user };
  }
});
// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
