const express = require("express");
const app = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20");
const GithubStrategy = require("passport-github2");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "NoteCraft-AI",
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/process-login",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_ID,
      callbackURL: "http://localhost:10000/auth/github/process-login",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
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
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/process-login",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.get(
  "/auth/github",
  passport.authenticate("github")
);

app.get(
  "/auth/github/process-login",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.use("/app/", ensureAuthenticated, appRoute);
