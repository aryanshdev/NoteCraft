const mongo = require("mongodb");

const URI =
  "mongodb+srv://aryanshdev:qwertyasdf123+-@notecraft.co24v.mongodb.net/";
const client = new mongo.MongoClient(URI, {});

client.connect();
let db = client.db("Main");
let notesGroupCollection = db.collection("notegroups");
let notesCollection = db.collection("note");
let usersCollection = db.collection("users");
module.exports = {
  notesCol: notesCollection,
  notesGroupCol: notesGroupCollection,
  usersCol : usersCollection
};
