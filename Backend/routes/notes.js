const router = require("express").Router();
const { notesCol } = require("../db/dbconnection");
const shortuid = require("short-unique-id");
const idgen = new shortuid({ length: 12 });

router.post("/getAll", async (req, res) => {
  if (Array.from(req.session.userGIDs).indexOf(req.body.id) !== -1)
{  var cur = await notesCol.find({
    ownerID: req.user.loggedinUserUUID,
    groupID: req.body.id,
  });
  res.send(await cur.toArray());}
  else{
    res.sendStatus(404)
  }
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
      res.sendStatus(200);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

async function deleteAllOfGroup(loggedinUserUUID,id){
  let ans =  (await notesCol.deleteMany({ownerID: loggedinUserUUID, groupID: id})).acknowledged
  console.log(ans
  )
  return ans;
}

module.exports = {router , deleteAllOfGroup};
