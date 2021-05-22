import { gql } from 'apollo-server-express';

export default gql`
    scalar DateTime
    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNextPage: Boolean!
    }
    type Note {
        id: ID!
        content: String!
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
        favoriteCount: Int!
        favoritedBy: [User]
    }
    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String!
        notes: [Note!]!
        favorites: [Note!]!
    }
    type Query {
        notes: [Note!]!
        note(id: ID!): Note!
        # add noteFeed to our existing queries
        noteFeed(cursor: String): NoteFeed

        user(username: String!): User
        users: [User!]!
        me: User!
    }
    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
        toggleFavorite(id: ID!): Note!

        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }
`;
