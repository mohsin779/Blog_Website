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
      creator: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
      },
    },
    { timestamps: true }
  )
);
