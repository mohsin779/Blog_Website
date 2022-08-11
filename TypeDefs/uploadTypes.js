const { gql } = require("apollo-server-express");
module.exports = gql`
  type Post {
    _id: ID!
    title: String!
    content: String!
    image: String!
    createdAt: String!
    updatedAt: String!
  }
  type PostsData {
    posts: [Post]!
  }
  type PostData {
    postData: Post!
  }
  extend type Query {
    greetings: String
    getPosts: PostsData!
    getPost(post: String!): PostData!
  }
  extend type Mutation {
    createPost(title: String!, content: String!, file: Upload): Result
    updatePost(
      post: String!
      title: String
      content: String
      file: Upload
    ): Result
    deletePost(post: String!): Result
  }
  type Result {
    message: String
  }
`;
