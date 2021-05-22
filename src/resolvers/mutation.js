import mongoose from 'mongoose';
import {
  AuthenticationError,
  ForbiddenError
} from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import gravatar from '../util/gravatar.js';

export default {
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
      await note.remove();
      return true;
    } catch (err) {
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
  toggleFavorite: async (parent, { id }, { noteModel, user }) => {
    // if no user context is passed, throw auth error
    if (!user) {
      throw new AuthenticationError();
    }
    let noteCheck = await noteModel.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0) {
      return await noteModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          new: true
        }
      );
    } else {
      return await noteModel.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
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
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
};
