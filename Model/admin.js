const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Schema = mongoose.Schema;
const adminSchema = new Schema(
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
);

adminSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      email: this.email,
      _id: this._id.toString(),
    },
    process.env.SUPER_KEY
    // { expiresIn: "1h" }
  );

  return token;
};

const Admin = mongoose.model("Admin", adminSchema);
exports.Admin = Admin;
