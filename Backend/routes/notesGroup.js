const router = require("express").Router();
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });
const { notesGroupCol } = require("../db/dbconnection");
const { deleteAllOfGroup } = require("./notes");

router.get("/getAll", async (req, res) => {
  var cur = await notesGroupCol.find({ ownerID: req.user.loggedinUserUUID });
  res.send(await cur.toArray());
});

router.post("/update", async (req, res) => {
  if (req.body.title && req.body.description) {
    notesGroupCol
      .updateOne(
        { ownerID: req.user.loggedinUserUUID, groupID: req.query.id },
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
    id = idgen.rnd();
    notesGroupCol
      .insertOne({
        ownerID: req.user.loggedinUserUUID,
        groupID: id,
        title: req.body.title,
        description: req.body.description,
        favourite: false,
      })
      .then(() => res.status(200).send(id))
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(400);
  }
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
    .deleteOne({ ownerID: req.user.loggedinUserUUID, groupID: req.body.id })
    .then(async () => {
      var resl = await deleteAllOfGroup(req.user.loggedinUserUUID,req.body.id);
      if (resl) res.sendStatus(200);
      else res.sendStatus(500);
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
