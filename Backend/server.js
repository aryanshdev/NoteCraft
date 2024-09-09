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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "NoteCraft-AI",
    resave: false,
    saveUninitialized: true,
  })
);

idgen = new ShortUniqueId({ length: 15 });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/process-login",
    },
    async (accessToken, refreshToken, profile, done) => {
      userData = await usersCol.findOne({ email: profile._json.email });
      if (userData) {
        return done(null, {uuid : userData.uuid});
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile._json.email,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.picture,
        });
        return done(null,{uuid : id});
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/process-login",
      scope: ["user:email"],
    },
     async (accessToken, refreshToken, profile, done) => {
      console.log(profile.emails[0].value)
      userData = await usersCol.findOne({ email: profile.emails[0].value });
      if (userData) {
        return done(null, {uuid : userData.uuid});
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile.emails[0].value,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.avatar_url,
        });
        return done(null,{uuid : id});
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

function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).redirect("http://localhost:5173/");
  }
}

app.listen(10000, () => {
  console.log("Server Up");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/process-login",
  passport.authenticate("google", { failureRedirect: "https://localhost:5173/login" }),
  async function (req, res) {
    req.session.loggedinUserUUID = req.user.uuid;
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/process-login",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    req.session.loggedinUserUUID = req.user.uuid;
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.use("/app/", ensureAuthenticated, appRoute);
