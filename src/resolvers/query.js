export default {
  notes: async (parent, args, { noteModel }) =>
    await noteModel.find(),
  note: async (parent, { id }, { noteModel }) =>
    await noteModel.findById(id),
  
  users: async (parent, args, { userModel }) => {
    return await userModel.find({});
  },
  user: async (parent, args, { userModel }) => {
    return await userModel.findOne({ username: args.username });
  },
  me: async (parent, args, { userModel, user }) => {
    return await userModel.findById(user.id);
  },
};
