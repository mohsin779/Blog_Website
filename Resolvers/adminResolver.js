const { Admin } = require("../Model/admin");
const { auth } = require("../Middlewares/isAuth");

const bcrypt = require("bcryptjs");

require("dotenv").config();

module.exports = {
  Query: {
    getAdmins: async (_, { page, limit }, context) => {
      const isAuth = auth(context.req);
      if (!isAuth) {
        return { error: "Not Authanticated" };
      }

      const currentPage = page || 1;
      const perPage = limit || 10;
      let totalAdmins = await Admin.find().countDocuments();

      const admins = await Admin.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      return { admins };
    },
    login: async (_, { email, password }) => {
      const admin = await Admin.findOne({ email: email });
      let error;
      if (!admin) {
        return {
          error: "Admin with this email not exist!",
        };
      }
      const isEqual = await bcrypt.compare(password, admin.password);
      if (!isEqual) {
        return {
          error: "Wrong Password",
        };
      }
      const token = admin.genAuthToken();
      return {
        admin,
        token,
        error,
      };
    },
  },
  Mutation: {
    signUp: async (_, { name, email, password }) => {
      const existingAdmin = await Admin.findOne({ email: email });
      let error;
      if (existingAdmin) {
        return {
          error: "An account with this email is already exist",
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
      const createdAdmin = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      return {
        message: "Account created Successfully!",
        admin: createdAdmin,
        token,
        error,
      };
    },
  },
};
