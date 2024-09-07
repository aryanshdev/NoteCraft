const express = require("express");
const app = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(10000, () => {
  console.log("Server Up");
});

app.use("/app/", appRoute);
