const router = require("express").Router();
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });
const { notesGroupCol } = require("../db/dbconnection");

router.get("/getAll", async (req, res) => {
  var cur = await notesGroupCol.find({ ownerID:  "120" });
  res.send(await cur.toArray());
});

router.post("/update", async (req, res) => {
  if (req.body.title && req.body.description) {
    notesGroupCol
      .updateOne(
        { ownerID: "120", groupID: req.query.id },
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
    notesGroupCol
      .insertOne({
        ownerID: "120",
        groupID: idgen.rnd(),
        title: req.body.title,
        description: req.body.description,
        favourite: false,
      })
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(400);
  }
});

router.post("/editFavourite", async (req, res) => {
    notesGroupCol
      .updateOne(
        { ownerID: "120", groupID: req.body.id },
        { $set: { favourite : req.body.favStatus } }
      )
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  } 
);

router.delete("/deleteNoteGroup" , async (req, res) => {
  notesGroupCol
    .deleteOne(
      { ownerID: "120", groupID: req.body.id }
    )
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
} 
);

module.exports = router;
