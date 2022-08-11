// const { uploadImage } = require("../Middlewares/file");
const { Post } = require("../Model/post");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

module.exports = {
  Query: {
    greetings: () => {
      return "Hello World";
    },
    getPosts: async () => {
      const posts = await Post.find();
      return { posts };
    },
    getPost: async (_, { post }) => {
      const postData = await Post.findById(post);
      console.log(postData);
      return { postData };
    },
  },
  Mutation: {
    createPost: async (_, { title, content, file }) => {
      //To upload Single Image to Cloudinary
      let imageUrl = "";
      if (file) {
        imageUrl = await processUpload(file);
      }

      //To upload image into 'Upload' Foder uncomment the below code
      // const imageUrl = await uploadImage(file);
      // console.log(imageUrl);

      const post = new Post({
        title,
        content,
        image: imageUrl,
      });
      await post.save();
      return {
        message: "Post created Successfully!",
      };
    },
    updatePost: async (_, { post, title, content, file }) => {
      const oldPost = await Post.findById(post);

      if (!oldPost) {
        return {
          message: "Post not found!",
        };
      } else {
        let imageUrl;
        if (file) {
          imageUrl = await processUpload(file);
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
    deletePost: async (_, { post }) => {
      const isPost = await Post.findById(post);
      if (!isPost) {
        return {
          message: "Post not found!",
        };
      } else {
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
