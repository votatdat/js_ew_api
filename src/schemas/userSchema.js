import { gql } from 'apollo-server-express';

const userSchema = gql`
    type Note {
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String!
        notes: [Note!]!
    }
    #    type Query {
    #        user(username: String!): User
    #        users: [User!]!
    #        me: User!
    #    }
    type Mutation {
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }
`;

export default userSchema;
