const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./Resolvers/main");
const typeDefs = require("./TypeDefs/main");

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req };
  },
});

module.exports = apolloServer;
