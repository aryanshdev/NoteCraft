const router = require("express").Router();
const { notesGroupCol, usersCol } = require("../db/dbconnection");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");

// Passport authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/process-login",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userData = await usersCol.findOne({ email: profile._json.email });
      let id = userData ? userData.uuid : idgen.rnd();

      if (!userData) {
        await usersCol.insertOne({
          email: profile._json.email,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.picture,
        });
      }

      // Generate JWT token

      const usedGIDs = (
        await notesGroupCol
          .find(
            { ownerID: userData ? userData.uuid : idgen.rnd() },
            { projection: { groupID: 1, _id: 0 } }
          )
          .toArray()
      ).map((ele) => ele.groupID);

      const token = jwt.sign(
        {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile._json.email,
          usedGIDs: usedGIDs,
        },
        process.env.SIGNING_KEY,
        { expiresIn: "30d" }
      );

      return done(null, token);
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
      const userData = await usersCol.findOne({
        email: profile.emails[0].value,
      });
      let id = userData ? userData.uuid : idgen.rnd();

      if (!userData) {
        await usersCol.insertOne({
          email: profile.emails[0].value,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.avatar_url,
        });
      }

      // Generate JWT token
      const usedGIDs = (
        await notesGroupCol
          .find(
            { ownerID:  userData ? userData.uuid : idgen.rnd() },
            { projection: { groupID: 1, _id: 0 } }
          )
          .toArray()
      ).map((ele) => ele.groupID);

      const token = jwt.sign(
        {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile._json.email,
          usedGIDs: usedGIDs,
        },
        process.env.SIGNING_KEY,
        { expiresIn: "30d" }
      );

      return done(null, token);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/process-login",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "https://notecraftai-xct5.onrender.com/login",
  }),
  async function (req, res) {
    console.log(req.user)
    res.cookie("_uid", req.user);
    res.redirect("https://notecraftai-xct5.onrender.com/dashboard");
  }
);

router.get("/github", passport.authenticate("github", { session: false }));

router.get(
  "/github/process-login",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "https://notecraftai-xct5.onrender.com/login",
  }),
  async function (req, res) {
    res.cookie("_uid", req.user);
    res.redirect("https://notecraftai-xct5.onrender.com/dashboard");
  }
);

function ensureAuthenticated(req, res, next) {
  const authToken = req.cookies._uid;
  if (!authToken) return res.sendStatus(401);
  
  try{
    let user = jwt.verify(authToken, process.env.SIGNING_KEY);
    req.user = user;
    next();
  }catch(e){
    res.sendStatus(401)
  }
  
}

router.post("/logout", (req, res) => {
  req.cookies.clear();
  res.sendStatus(200);
});

module.exports = { router, ensureAuthenticated };
