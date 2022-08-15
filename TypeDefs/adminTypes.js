const { gql } = require("apollo-server-express");
module.exports = gql`
  type Admin {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }
  type AdminsData {
    admins: [Admin]!
  }
  type LoginData {
    admin: Admin
    token: String
    error: String
  }

  extend type Query {
    getAdmins(page: Int, limit: Int): AdminsData!
    login(email: String, password: String): LoginData!
  }
  extend type Mutation {
    signUp(name: String!, email: String!, password: String!): Result
  }
  type Result {
    message: String
    admin: Admin
    token: String
    error: String
  }
`;
