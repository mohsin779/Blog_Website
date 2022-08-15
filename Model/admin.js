const { Schema, model } = require("mongoose");

module.exports.Admin = model(
  "Admin",
  Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        require: true,
      },
      password: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  )
);
