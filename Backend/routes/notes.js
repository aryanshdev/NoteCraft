const router = require("express").Router();
const {notesCol} = require("../db/dbconnection")

router.get("/getAll", async (req,res)=>{
    var cur = await notesCol.find({"ownerID":"120"})
   res.send(await cur.toArray());
})

module.exports=router;