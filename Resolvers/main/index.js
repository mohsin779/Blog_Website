const resolvers = require("../resolver");

async function graphQLUpload() {
  return await import("graphql-upload/GraphQLUpload.mjs").default;
}

const customResolvers = {
  Upload: graphQLUpload(),
};
module.exports = [customResolvers, resolvers];
