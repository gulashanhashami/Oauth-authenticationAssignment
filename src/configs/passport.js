require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");
const { newToken } = require("../controllers/auth.controller");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:2345/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile?._json?.email })
        .lean()
        .exec();

      if (!user) {
        user = await User.create({
          name: profile?._json?.name,
          email: profile?._json?.email,
          password: uuidv4(),
          //roles: ["User"], 
        });
      }
      const token = newToken(user);
      return done(null, { user, token });
    }
  )
);
module.exports = passport;
