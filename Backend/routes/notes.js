const router = require("express").Router();
const { notesCol } = require("../db/dbconnection");
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });
const jwt = require("jsonwebtoken");

router.post("/getAll", async (req, res) => {
  if (
    Array.from(jwt.decode(req.cookies._uid).usedGIDs).indexOf(req.body.id) !==
    -1
  ) {
    var cur = await notesCol.find({
      ownerID: req.user.loggedinUserUUID,
      groupID: req.body.id,
    });
    res.send(await cur.toArray());
  } else {
    res.sendStatus(404);
  }
});

router.get("/getSharingInfo", async (req, res) => {
  res.json({ user: req.user.loggedinUserUUID });
});

router.post("/editFavourite", async (req, res) => {
  notesCol
    .updateOne(
      {
        ownerID: req.user.loggedinUserUUID,
        groupID: req.body.gid,
        noteID: req.body.nid,
      },
      { $set: { favourite: req.body.favStatus } }
    )
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

router.post("/new", async (req, res) => {
  if (req.body.title && req.body.description) {
    id = idgen.rnd();
    notesCol
      .insertOne({
        ownerID: req.user.loggedinUserUUID,
        groupID: req.body.gid,
        title: req.body.title,
        body: req.body.description,
        favourite: false,
        noteID: id,
      })
      .then(() => {
        res.status(200).send(id);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
});

router.post("/update", async (req, res) => {
  if (req.body.title && req.body.description) {
    notesCol
      .updateOne(
        {
          ownerID: req.user.loggedinUserUUID,
          groupID: req.body.gid,
          noteID: req.body.nid,
        },
        { $set: { title: req.body.title, body: req.body.description } }
      )
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(400);
  }
});

router.delete("/deleteNote", async (req, res) => {
  notesCol
    .deleteOne({
      ownerID: req.user.loggedinUserUUID,
      groupID: req.body.gid,
      noteID: req.body.nid,
    })
    .then(async () => {
      res.sendStatus(200);
    })
    .catch(() => res.sendStatus(500));
});

async function deleteAllOfGroup(loggedinUserUUID, id) {
  let ans = (
    await notesCol.deleteMany({ ownerID: loggedinUserUUID, groupID: id })
  ).acknowledged;
  return ans;
}

module.exports = { router, deleteAllOfGroup };
