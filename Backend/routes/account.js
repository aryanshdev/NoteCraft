const router = require("express").Router();
const { usersCol } = require("../db/dbconnection");

router.get("/getInfo" , async (req,res)=>{
    res.send( await usersCol.findOne({uuid : req.user.loggedinUserUUID}));
    
} )

module.exports = router;