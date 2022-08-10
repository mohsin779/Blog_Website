const express = require("express");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const configureCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};
configureCloudinary();

require("./config/morgan")(app);
app.use("/Upload", express.static(path.join(__dirname, "uploads")));

module.exports = app;
