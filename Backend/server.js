const express = require("express");
const app = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");
const { usersCol } = require("./db/dbconnection");
const ShortUniqueId = require("short-unique-id");
const {router : authRouter, ensureAuthenticated} = require("./routes/auth");
const helmet = require("helmet");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "NoteCraft-AI",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(helmet())

idgen = new ShortUniqueId({ length: 15 });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://98nhd68r-5173.inc1.devtunnels.ms/auth/google/process-login",
    },
    async (accessToken, refreshToken, profile, done) => {
      userData = await usersCol.findOne({ email: profile._json.email });
      if (userData) {
        return done(null, {
          userName: userData.name,
          loggedinUserUUID: userData.uuid,
        });
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile._json.email,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.picture,
        });
        return done(null, {
          userName: profile._json.name,
          loggedinUserUUID: id,
        });
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://98nhd68r-5173.inc1.devtunnels.ms/auth/github/process-login",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      userData = await usersCol.findOne({ email: profile.emails[0].value });
      if (userData) {
        return done(null, {
          userName: userData.name,
          loggedinUserUUID: userData.uuid,
        });
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile.emails[0].value,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.avatar_url,
        });
        return done(null, {
          userName: profile._json.name,
          loggedinUserUUID: id,
        });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());



app.listen(10000, () => {
  console.log("Server Up");
});


app.use("/auth", authRouter)
app.use("/app", ensureAuthenticated, appRoute);
