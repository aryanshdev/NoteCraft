const router = require("express").Router();
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });
const { notesGroupCol } = require("../db/dbconnection");
const { deleteAllOfGroup } = require("./notes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/getAll", async (req, res) => {
  var cur = notesGroupCol.find({ ownerID: jwt.decode(req.cookies._uid).loggedinUserUUID });
  res.send(await cur.toArray());
});

router.post("/update", async (req, res) => {
  if (req.body.title && req.body.description) {
    notesGroupCol
      .updateOne(
        { ownerID: req.user.loggedinUserUUID, groupID: req.body.id },
        { $set: { title: req.body.title, description: req.body.description } }
      )
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(400);
  }
});

router.post("/new", async (req, res) => {
  if (req.body.title && req.body.description) {
    try {
      const id = idgen.rnd();
      await notesGroupCol.insertOne({
        ownerID: jwt.decode(req.cookies._uid).loggedinUserUUID,
        groupID: id,
        title: req.body.title,
        description: req.body.description,
        favourite: false,
        editors: [],
      });

      const userData = jwt.decode(req.cookies._uid);
      userData.userGIDs = userData.userGIDs.concat([id]);
      const token = jwt.sign(userData, process.env.SIGNING_KEY);
      res.cookie("_uid", token, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          secure: true,
      sameSite: "none",
        });
      res.status(200).send(id);
    } catch (e) {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

router.post("/addEditor", async (req, res) => {
  notesGroupCol
    .updateOne(
      {
        ownerID: req.user.loggedinUserUUID,
        groupID: req.body.gid,
      },
      { $push: { editors: req.body.email } }
    )
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

router.get("/getEditors/:gid", async (req, res) => {
  try {
    var data = await notesGroupCol
      .find(
        {
          ownerID: req.user.loggedinUserUUID,
          groupID: req.params.gid,
        },
        { projection: { editors: 1, _id: 0 } }
      )
      .toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.delete("/removeEditor", async (req, res) => {
  notesGroupCol
    .updateOne(
      {
        ownerID: req.user.loggedinUserUUID,
        groupID: req.body.gid,
      },
      { $pull: { editors: req.body.email } }
    )
    .then(() => res.sendStatus(200))
    .catch((e) => {
      res.sendStatus(500);
    });
});

router.post("/editFavourite", async (req, res) => {
  notesGroupCol
    .updateOne(
      { ownerID: req.user.loggedinUserUUID, groupID: req.body.id },
      { $set: { favourite: req.body.favStatus } }
    )
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

router.delete("/deleteNoteGroup", async (req, res) => {
  notesGroupCol
    .deleteOne({
      ownerID: jwt.decode(req.cookies._uid).loggedinUserUUID,
      groupID: req.body.id,
    })
    .then(async () => {
      var resl = await deleteAllOfGroup(
        jwt.decode(req.cookies._uid).loggedinUserUUID,
        req.body.id
      );
      if (resl) {
        const userData = jwt.decode(req.cookies._uid);

        userData.userGIDs = jwt
          .decode(req.cookies._uid)
          .userGIDs.filter((id) => id !== req.body.id);

        const token = jwt.sign(userData, process.env.SIGNING_KEY);
        res.cookie("_uid", token, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          secure: true,
      sameSite: "none",
        });
        res.sendStatus(200);
      } else res.sendStatus(500);
    })
    .catch((e) => {
      res.sendStatus(500);
    });
});

module.exports = router;
