const mongo = require("mongodb");
require("dotenv").config();
const URI =
  process.env.DBURL;
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
