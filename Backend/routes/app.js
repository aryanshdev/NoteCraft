const router = require("express").Router();
const notesRouter = require("./notes");
const notesGroupRouter = require("./notesGroup");

router.get("/", (req, res) => {
  res.send("Hiiii");
});

router.use("/notesgroup", notesGroupRouter);
router.use("/notes", notesRouter);

module.exports = router;
