const { gql } = require("apollo-server-express");
const postTypeDefs = require("../postTypes");
const adminTypeDefs = require("../adminTypes");

const typeDefs = gql`
  scalar Upload
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

module.exports = [typeDefs, postTypeDefs, adminTypeDefs];
