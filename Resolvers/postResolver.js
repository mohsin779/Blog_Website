// const { uploadImage } = require("../Middlewares/file");
const { auth } = require("../Middlewares/isAuth");

const { Post } = require("../Model/post");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

module.exports = {
  Query: {
    greetings: () => {
      return "Hello World";
    },
    getPosts: async (_, { page, limit }) => {
      const currentPage = page || 1;
      const perPage = limit || 10;
      let totalPosts = await Post.find().countDocuments();

      const posts = await Post.find()
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      return { posts, totalPosts };
    },
    getPost: async (_, { post }) => {
      const postData = await Post.findById(post).populate("creator");
      console.log(postData);
      return { postData };
    },
    getMyPosts: async (_, { page, limit }, context) => {
      const isAuth = auth(context.req);
      if (!isAuth) {
        return { error: "Not Authanticated" };
      }

      const currentPage = page || 1;
      const perPage = limit || 10;
      let totalPosts = await Post.find({
        creator: context.req.user._id,
      }).countDocuments();

      const posts = await Post.find({ creator: context.req.user._id })
        .populate("creator")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      return { posts, totalPosts };
    },
  },
  Mutation: {
    createPost: async (_, { title, content, file }, context) => {
      const isAuth = auth(context.req);
      if (!isAuth) {
        return { error: "Not Authanticated" };
      }

      //To upload Single Image to Cloudinary

      //To upload file into Clodinary from backend
      // let imageUrl = file;
      // if (file) {
      //   imageUrl = await processUpload(file);

      // }

      //To upload image into 'Upload' Fodler, uncomment the below code
      // const imageUrl = await uploadImage(file);
      // console.log(imageUrl);

      const post = new Post({
        title,
        content,
        image: file,
        creator: context.req.user._id,
      });
      await post.save();
      return {
        message: "Post created Successfully!",
      };
    },
    updatePost: async (_, { post, title, content, file }, context) => {
      const isAuth = auth(context.req);
      if (!isAuth) {
        return { error: "Not Authanticated" };
      }
      const oldPost = await Post.findById(post);

      if (oldPost.creator != context.req.user._id) {
        return { error: "Not Authanticated" };
      }

      if (!oldPost) {
        return {
          message: "Post not found!",
        };
      } else {
        let imageUrl;
        if (file) {
          // imageUrl = await processUpload(file);
          imageUrl = file;
          var filename = oldPost.image.split("/").pop();
          filename = filename.split(".")[0];
          cloudinary.uploader.destroy(filename);
          oldPost.image = imageUrl;
        }
        oldPost.title = title;
        oldPost.content = content;
        await oldPost.save();

        return {
          message: "Post updated Successfully",
        };
      }
    },
    deletePost: async (_, { post }, context) => {
      const isAuth = auth(context.req);
      if (!isAuth) {
        return { error: "Not Authanticated" };
      }
      const isPost = await Post.findById(post);
      if (!isPost) {
        return {
          error: "Post not found!",
        };
      } else {
        if (context.req.user._id != isPost.creator) {
          return { error: "Not Authanticated" };
        }
        var filename = isPost.image.split("/").pop();
        filename = filename.split(".")[0];
        cloudinary.uploader.destroy(filename);
        await Post.findByIdAndRemove(post);
        return {
          message: "Post Deleted Successfully!",
        };
      }
    },
  },
};

const processUpload = async (upload) => {
  const { createReadStream } = await upload.file;
  const stream = createReadStream();

  let resultUrl = "",
    resultSecureUrl = "";
  const cloudinaryUpload = async ({ stream }) => {
    try {
      await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_stream(function (
          error,
          result
        ) {
          if (result) {
            resultUrl = result.secure_url;
            resultSecureUrl = result.secure_url;
            resolve(resultUrl);
          } else {
            reject(error);
          }
        });

        stream.pipe(streamLoad);
      });
    } catch (err) {
      throw new Error(`Failed to upload profile picture ! Err:${err.message}`);
    }
  };

  await cloudinaryUpload({ stream });
  return resultUrl;
};
