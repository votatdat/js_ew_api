const noteResolvers = {
  Query: {
    hello: () => 'Hello World!',
    notes: () => async (parent, args, { noteModel }) =>
      await noteModel.find(),
    note: async (parent, args, { noteModel }) =>
      await noteModel.findById(args.id)
  },
  Mutation: {
    newNote: async (parent, args, { noteModel }) => {
      let newNote = {
        content: args.content,
        author: 'new author',
      };
      return await noteModel.create(newNote);
    }
  }
};

export default noteResolvers;
