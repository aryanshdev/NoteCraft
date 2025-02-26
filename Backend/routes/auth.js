const router = require("express").Router();
const passport = require("passport");
const { notesGroupCol } = require("../db/dbconnection");

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
    session:false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async function (req, res) {
    res.redirect("http://localhost:5173/dashboard");
    req.session.userGIDs = (
      await notesGroupCol
        .find(
          {
            ownerID: req.user.loggedinUserUUID,
          },
          { groupID: 1, _id: 0 }
        )
        .toArray()
    ).map((ele) => ele.groupID);
    req.session.save();
  }
);

router.get("/github", passport.authenticate("github", { session: false }));

router.get(
  "/github/process-login",
  passport.authenticate("github", {
    session:false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async function (req, res) {
    res.redirect("http://localhost:5173/dashboard");
    req.session.userGIDs = (
      await notesGroupCol
        .find(
          {
            ownerID: req.user.loggedinUserUUID,
          },
          { groupID: 1, _id: 0 }
        )
        .toArray()
    ).map((ele) => ele.groupID);
    req.session.save();
  }
);

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1]; // Bearer <token>
  jwt.verify(token, process.env.SIGNING_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post("/logout", (req, res) => {
  res.sendStatus(200);
});

module.exports = { router, ensureAuthenticated };
