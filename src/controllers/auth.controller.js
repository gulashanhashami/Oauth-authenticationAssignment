require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const newToken = (user) => {
  return jwt.sign({ user: user }, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60 * 5,
  });
};

const register = async (req, res) => {
  try { 
    //code for, if the email provided is already given to another user
    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user)
      return res
        .status(400)
        .send({ message: "User with that email already exists" });

    // code for, hash the password for the user
    user = await User.create(req.body);

    // code for, to create the token for the user
    const token = newToken(user);

    //then return the token and the user details
    return res.status(201).send({ user, token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .send({ message: "Please check your email or password." });
    const match = user.checkPassword(req.body.password);
    if (!match)
      return res
        .status(400)
        .send({ message: "Please check your email or password." });

    const token = newToken(user);
    //then return the token and the user details
    return res.status(201).send({ user, token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = { register, login, newToken };
