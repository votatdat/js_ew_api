import { gql } from 'apollo-server-express';

const noteSchema = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note!
    }
    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
    }
`;

export default noteSchema;
