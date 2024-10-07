const router = require("express").Router();
const passport = require("passport");
const { notesGroupCol } = require("../db/dbconnection");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/process-login",
  passport.authenticate("google", {
    failureRedirect: "https://notecraft-ai.onrender.com/login",
  }), 
  async function (req, res) {
    res.redirect("https://notecraft-ai.onrender.com/dashboard");
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

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/process-login",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async function (req, res) {
    res.redirect("https://notecraft-ai.onrender.com/dashboard");
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
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

router.post("/logout", (req, res) => {req.logout(err=>{
  if (err){
    res.sendStatus(500)
    return
  }
  res.sendStatus(200)
})});

module.exports = { router, ensureAuthenticated };
