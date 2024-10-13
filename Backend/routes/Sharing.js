const router = require("express").Router();
const { notesCol, notesGroupCol } = require("../db/dbconnection");
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });

function ensureEditor() {}

router.post("/sharedGetAll", async (req, res) => {
  var cur = await notesCol.find({
    ownerID: req.body.uid,
    groupID: req.body.gid,
  });
  try {
    data = (
      await notesGroupCol
        .find(
          {
            ownerID: req.body.uid,
            groupID: req.body.gid,
          },
          { projection: { editors: 1, _id: 0 } }
        )
        .toArray()
    )[0]["editors"];
  } catch (error) {
    data = []
  }
  console.log(req.user)
  var isEditor = req.user ? data.includes(req.user.loggedUserEmail) : false;
  try {
    req.session.sharedOpened[req.body.gid] = isEditor;
  } catch (error) {
    req.session.sharedOpened = { [req.body.gid]: isEditor };
  }
  req.session.save();
  console.log(isEditor)
  res.json({ notes: await cur.toArray(), editor: isEditor });
});

router.post("/editFavouriteShared", async (req, res) => {
  notesCol
    .updateOne(
      { ownerID: req.body.uid, groupID: req.body.gid, noteID: req.body.nid },
      { $set: { favourite: req.body.favStatus } }
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.post("/updateShared", async (req, res) => {
  if (
    req.body.title &&
    req.body.description &&
    req.session.sharedOpened[req.body.gid]
  ) {
    notesCol
      .updateOne(
        {
          ownerID: req.body.uid,
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

router.post("/newNoteShared", async (req, res) => {
  if (
    req.body.title &&
    req.body.description &&
    req.session.sharedOpened[req.body.gid]
  ) {
    id = idgen.rnd();
    notesCol
      .insertOne({
        ownerID: req.body.uid,
        groupID: req.body.gid,
        title: req.body.title,
        body: req.body.description,
        favourite: false,
        noteID: id,
      })
      .then(() => {
        res.status(200).send(id);
      })
      .catch(() => res.sendStatus(500));
  } else {
    res.sendStatus(400);
  }
});

router.delete("/deleteShared", async (req, res) => {
  notesCol
    .deleteOne({
      ownerID: req.body.uid,
      groupID: req.body.gid,
      noteID: req.body.nid,
    })
    .then(async () => {
      res.sendStatus(200);
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
