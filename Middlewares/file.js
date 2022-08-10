const { parse, join } = require("path");
const { createWriteStream } = require("fs");

const fs = require("fs");

module.exports.uploadImage = async (file) => {
  const { createReadStream, filename } = await file.file;
  const stream = createReadStream();
  var { ext, name } = parse(filename);
  name = `single${Math.floor(Math.random() * 10000 + 1)}`;
  let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
  const imageStream = await createWriteStream(url);
  await stream.pipe(imageStream);
  const baseUrl = process.env.BASE_URL;
  const port = process.env.port;
  url = url.split("Upload")[1];
  url = "Upload" + url;
  return url;
};
