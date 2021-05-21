import pkg from 'graphql-iso-date';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express';
import dotenv from 'dotenv';
import gravatar from '../util/gravatar.js';

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
    newNote: async (parent, { content }, { noteModel }) => {
      let newNote = {
        content: content,
        author: 'new author',
      };
      return await noteModel.create(newNote);
    },
    deleteNote: async (parent, { id }, { noteModel }) => {
      try {
        await noteModel.findOneAndDelete({ _id: id });
        return true;
      } catch (e) {
        return false;
      }
    },
    updateNote: async (parent, { content, id }, { noteModel }) => {
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
    }
  }
};

export default noteResolvers;
