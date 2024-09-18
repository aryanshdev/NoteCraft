const router = require("express").Router();
const { notesCol } = require("../db/dbconnection");

router.post("/sharedGetAll", async (req, res) => {
  var cur = await notesCol.find({
    ownerID: req.body.uid,
    groupID: req.body.gid,
  });
  res.send(await cur.toArray());
});

// router.post("/editFavouriteShared", async (req, res) => {
//   notesCol
//     .updateOne(
//       { ownerID: req.body.uid, groupID: req.body.gid, noteID: req.body.nid },
//       { $set: { favourite: req.body.favStatus } }
//     )
//     .then(() => {
//       res.sendStatus(200);
//     })
//     .catch(() => {
//       res.sendStatus(500);
//     });
// });

module.exports = router;
