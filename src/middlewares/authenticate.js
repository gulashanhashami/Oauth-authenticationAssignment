require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, user) {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

module.exports = async (req, res, next) => {
  //code for, if authentication token is inside the request headers
  if (!req.headers?.authorization)
    return res
      .status(400)
      .send({ message: "Please provide a valid authorization token" });
  const bearerToken = req.headers.authorization;

  if (!bearerToken.startsWith("Bearer "))
    return res
      .status(400)
      .send({ message: "Please provide a valid authorization token" });

  // code for, to verify the token and get the user from the token
  const token = bearerToken.split(" ")[1];
  let user;
  try {
    user = await verifyToken(token); // user.user
  } catch (err) {
    return res.status(401).send({ message: "The token is not valid" });
  }
  //code for, to attach the user to the request
  req.user = user.user;
  next();
};
