const express = require("express");
const passport = require("./configs/passport");

const { register, login } = require("./controllers/auth.controller");
const productController = require("./controllers/product.controller");

const app = express();
app.use(express.json());
app.post("/register", register);
app.post("/login", login);
app.use(passport.initialize());

app.use("/products", productController); 

passport.serializeUser(function (user, callback) {
  callback(null, user);
});
passport.deserializeUser(function (user, callback) {
  callback(null, user);
});

app.get( 
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => { 
    return res.status(201).json({ user: req.user.user, token: req.user.token });
  }
);
app.get("/auth/google/failure", (req, res) => {
  return res.send("Failure");
});

 
module.exports = app;
