export default {
  author: async (note, args, { userModel }) => {
    return await userModel.findById(note.author);
  },
  // Resolved the favoritedBy info for a note when requested
  favoritedBy: async (note, args, { userModel }) => {
    return await userModel.find({ _id: { $in: note.favoritedBy } });
  },
};
