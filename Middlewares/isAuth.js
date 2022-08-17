const jwt = require("jsonwebtoken");

module.exports.auth = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return false;
  }
  const token = authHeader.split(" ").pop();

  let decodedUser;
  decodedUser = jwt.verify(token, process.env.SUPER_KEY);

  if (!decodedUser) {
    return false;
  }
  req.user = decodedUser;
  return true;
};
