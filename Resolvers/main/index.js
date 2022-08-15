const adminResolvers = require("../adminResolver");
const postResolvers = require("../postResolver");

async function graphQLUpload() {
  return await import("graphql-upload/GraphQLUpload.mjs").default;
}

const customResolvers = {
  Upload: graphQLUpload(),
};
module.exports = [customResolvers, postResolvers, adminResolvers];
