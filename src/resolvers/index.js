import GraphQLDateTime from 'graphql-iso-date';

import Query from './query.js';
import Mutation from './mutation.js';
import Note from './note.js';
import User from './user.js';

export default {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime,
};
