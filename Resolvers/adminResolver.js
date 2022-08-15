const { Admin } = require("../Model/admin");
const bcrypt = require("bcryptjs");

require("dotenv").config();

module.exports = {
  Query: {
    getAdmins: async (_, { page, limit }) => {
      const currentPage = page || 1;
      const perPage = limit || 10;
      let totalAdmins = await Admin.find().countDocuments();

      const admins = await Admin.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      return { admins };
    },
  },
  Mutation: {
    signUp: async (_, { name, email, password }) => {
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return {
          message: "An account with this email is already exist",
        };
      }

      const hashedPw = await bcrypt.hash(password, 12);

      const admin = new Admin({
        name,
        email,
        password: hashedPw,
      });
      const result = await admin.save();
      const token = result.genAuthToken();

      return {
        message: "Account created Successfully!",
        token,
      };
    },
  },
};
