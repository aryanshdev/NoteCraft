const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { usersCol, notesCol, notesGroupCol } = require("../db/dbconnection");
const crypto = require("crypto");

router.get("/getInfo", async (req, res) => {
  res.send(await usersCol.findOne({ uuid: jwt.decode(req.cookies._uid, process.env.SIGNING_CODE).loggedinUserUUID }));
});
router.get("/getName", async (req, res) => {
  res.send((jwt.decode(req.cookies._uid)).userName);
});

router.put("/updateProfileImage", async (req, res) => {
  const hashedEmail = crypto
    .createHash("sha256")
    .update(req.user.loggedUserEmail)
    .digest("hex");
  await fetch(`https://api.gravatar.com/v3/profiles/${hashedEmail}`, {
    headers: {
      Authorization: `Bearer ${process.env.GRAVTAR_API}`,
    },
  })
    .then((response) => {
      switch (response.status) {
        case 404:
          res.sendStatus(404);
          return;
        case 200:
          return response.json();
      }
    })
    .then((response) => {
      if (response) {
        usersCol.updateOne(
          { uuid: req.user.loggedinUserUUID },
          { $set: { pfp: response.avatar_url } }
        );
        res.send(response.avatar_url);
      }
    });
});

router.delete("/resetAccount", async (req, res) => {
  try {
    notesGroupCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    notesCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete("/deleteAccount", async (req, res) => {
  try {
    notesGroupCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    notesCol.deleteMany({ ownerID: req.user.loggedinUserUUID });
    usersCol.deleteOne({ uuid: req.user.loggedinUserUUID });
    
    res.clearCookie("_uid", {
      secure: true,
      sameSite: "none",
    }).sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
