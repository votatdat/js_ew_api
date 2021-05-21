import pkg from 'graphql-iso-date';

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
  }
};

export default noteResolvers;
