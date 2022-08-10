const { Schema, model } = require("mongoose");

module.exports.Post = model(
  "Post",
  Schema(
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        require: true,
      },
      image: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  )
);
