const { gql } = require("apollo-server-express");
module.exports = gql`
  type Admin {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  type AdminsData {
    admins: [Admin]!
  }

  extend type Query {
    getAdmins(page: Int, limit: Int): AdminsData!
  }
  extend type Mutation {
    signUp(name: String!, email: String!, password: String!): Result
  }
  type Result {
    message: String
  }
`;
