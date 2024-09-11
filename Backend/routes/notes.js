const router = require("express").Router();
const { notesCol } = require("../db/dbconnection");
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });

router.post("/getAll", async (req, res) => {
  var cur = await notesCol.find({
    ownerID: req.user.loggedinUserUUID,
    groupid: req.body.id,
  });
  res.send(await cur.toArray());
});

router.post("/new", async (req, res) => {
  notesCol
    .insertOne({
      ownerID: req.user.loggedinUserUUID,
      groupID: req.body.gid,
      title: req.body.title,
      body: req.body.description,
      favourite: false,
      noteID: idgen.rnd(),
    })
    .then(() => {
      res.status(200).send("OK");
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

module.exports = router;
