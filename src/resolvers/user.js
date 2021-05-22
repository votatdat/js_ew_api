export default {
  // Resolve the list of notes for a user when requested
  notes: async (user, args, { noteModel }) => {
    return await noteModel.find({ author: user._id }).sort({ _id: -1 });
  },
  // Resolve the list of favorites for a user when requested
  favorites: async (user, args, { noteModel }) => {
    return await noteModel.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};
