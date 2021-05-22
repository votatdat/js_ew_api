import { gql } from 'apollo-server-express';

const noteSchema = gql`
    scalar DateTime
    type Note {
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime!
        updatedAt: DateTime!
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
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }
`;

export default noteSchema;
