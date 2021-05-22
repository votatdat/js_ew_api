import mongoose from 'mongoose';
import pkg from 'graphql-iso-date';
import {
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express';

const { GraphQLDateTime } = pkg;


const noteResolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    hello: () => 'Hello World!',
    notes: async (parent, args, { noteModel }) =>
      await noteModel.find(),
    note: async (parent, { id }, { noteModel }) =>
      await noteModel.findById(id)
  },
  Mutation: {
    newNote: async (parent, { content }, { noteModel, user }) => {
      if (!user) {
        throw new AuthenticationError(
          'You must be signed in to create a note'
        );
      }
      let newNote = {
        content: content,
        author: mongoose.Types.ObjectId(user.id)
      };
      return await noteModel.create(newNote);
    },
    deleteNote: async (parent, { id }, { noteModel, user }) => {
      if (!user) {
        throw new AuthenticationError(
          'You must be signed in to delete a note'
        );
      }
      const note = await noteModel.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError(
          'You don\'t have permissions to delete the note'
        );
      }
      try {
        // if everything checks out, remove the note
        await note.remove();
        return true;
      } catch (err) {
        // if there's an error along the way, return false
        return false;
      }
    },
    updateNote: async (parent, { content, id }, { noteModel, user }) => {
      if (!user) {
        throw new AuthenticationError('You must be signed in to update a note');
      }
      const note = await noteModel.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError('You don\'t have permissions to update the note');
      }
      return await noteModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            content
          }
        },
        {
          new: true
        }
      );
    },
  }
};

export default noteResolvers;
