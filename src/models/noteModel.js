import mongoose from 'mongoose';

// Define the note's database schema
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    }
  },
  {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamp: true,
  }
);

// Define the 'Note' model with the schema
const noteModel = mongoose.model('Note', noteSchema);

export default noteModel;
