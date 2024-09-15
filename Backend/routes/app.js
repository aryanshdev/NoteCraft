const router = require("express").Router();
const {router: notesRouter } = require("./notes");
const notesGroupRouter = require("./notesGroup");
const userRouter = require("./account")

router.get("/", (req, res) => {
  res.send("Hiiii");
});

router.use("/notesgroup", notesGroupRouter);
router.use("/notes", notesRouter);
router.use("/account", userRouter)

module.exports = router;
