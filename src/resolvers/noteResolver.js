import mongoose from 'mongoose';
import pkg from 'graphql-iso-date';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express';
import gravatar from '../util/gravatar.js';

const { GraphQLDateTime } = pkg;


const noteResolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    hello: () => 'Hello World!',
    notes: async (parent, args, { noteModel }) =>
      await noteModel.find(),
    note: async (parent, { id }, { noteModel }) =>
      await noteModel.findById(id),

    user: async (parent, { username }, { userModel }) => {
      // find a user given their username
      return await userModel.findOne({ username });
    },
    users: async (parent, args, { userModel }) => {
      // find all users
      return await userModel.find({});
    },
    me: async (parent, args, { userModel, user }) => {
      // find a user given the current user context
      return await userModel.findById(user.id);
    },
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

    signUp: async (parent, { username, email, password }, { userModel }) => {
      email = email.trim().toLowerCase();
      const hashed = await bcrypt.hash(password, 10);
      const avatar = gravatar(email);

      try {
        const user = await userModel.create({
          username,
          email,
          avatar,
          password: hashed,
        });

        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      } catch (e) {
        console.log(e);
        throw new Error('Error Creating Account');
      }
    },
    signIn: async (parent, { username, email, password }, { userModel }) => {
      if (email) {
        email = email.trim().toLowerCase();
      }
      const user = await userModel.findOne({
        $or: [{ email }, { username }]
      });
      if (!user) {
        throw new AuthenticationError('Error signing in');
      }
      // if the passwords don't match, throw an authentication error
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new AuthenticationError('Error signing in');
      }
      // create and return the json web token
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },
  }
};

export default noteResolvers;
