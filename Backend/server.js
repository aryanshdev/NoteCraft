const express = require("express");
const expressServer = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");
const passport = require("passport");
// const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");
const { usersCol } = require("./db/dbconnection");
const ShortUniqueId = require("short-unique-id");
const { router: authRouter, ensureAuthenticated } = require("./routes/auth");
const sharingRouter = require("./routes/Sharing");
const helmet = require("helmet");
const cors = require("cors");
const Groq = require("groq-sdk");
const http = require("http"); // Create HTTP server
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = http.createServer(expressServer); // Attach Express to the server
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const idgen = new ShortUniqueId({ length: 15 });

// Socket.io server
const io = new Server(app, {
  cors: {
    origin: [
      "http://localhost:10000", // Removed trailing slash
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  },
});

// Socket.io event handling
io.on("connection", (socket) => {
  socket.on("createRoom", ([roomID, name]) => {
    socket.join(roomID);
    socket.roomID = roomID;
    socket.userName = String(name).split(" ")[0];
    socket.emit("SYSTEM", "Welcome !!"); // to user joining the room
    socket.to(roomID).emit("SYSTEM", `${name} has joined the room`); // to everyone else
  });

  socket.on("UserToServer", (message) => {
    socket
      .to(socket.roomID)
      .emit("USER", { message: message, name: socket.userName });
  });

  socket.on("ASKAI", async (message) => {
    socket.emit("SELF", "@NC-AI " + message.split("|")[1]);
    socket.to(socket.roomID).emit("AIQUESTION", {
      message: "@NC-AI " + message.split("|")[1],
      name: socket.userName,
    });
    let reply = await AskAIGroq(message);
    io.to(socket.roomID).emit("AIMessage", { message: reply });
  });

  // Collab Handling
  socket.on("shared_NoteDelete", (nid, loggedName) => {
    socket.broadcast.emit("shared_NoteDelete", nid, loggedName);
  });

  socket.on("shared_NoteAdded", (details, loggedName) => {
    socket.broadcast.emit("shared_NoteAdded", details, loggedName);
  });

  socket.on("shared_NoteUpdate", (details, loggedName) => {
    socket.broadcast.emit("shared_NoteUpdate", details, loggedName);
  });

  socket.on("shared_AlterFavourite", (nid, loggedName) => {
    socket.broadcast.emit("shared_AlterFavourite", nid, loggedName);
  });
});

io.on("disconnection", () => {});

// Middleware and security settings
expressServer.use(bodyParser.json());
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(cookieParser());

expressServer.use(helmet());

expressServer.use(
  cors({
    origin: "http://localhost:5173", // Frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    origin: true,
  })
);

// Passport authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:10000/auth/google/process-login",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userData = await usersCol.findOne({ email: profile._json.email });
      let id = userData ? userData.uuid : idgen.rnd();

      if (!userData) {
        await usersCol.insertOne({
          email: profile._json.email,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.picture,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile._json.email,
        },
        process.env.SIGNING_KEY,
        { expiresIn: "30d" }
      );

      return done(null, token);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:10000/auth/github/process-login",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const userData = await usersCol.findOne({
        email: profile.emails[0].value,
      });
      let id = userData ? userData.uuid : idgen.rnd();

      if (!userData) {
        await usersCol.insertOne({
          email: profile.emails[0].value,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.avatar_url,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile.emails[0].value,
        },
        process.env.SIGNING_KEY,
        { expiresIn: "30d" }
      );

      return done(null, token);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


expressServer.use(passport.initialize());

// Routes
expressServer.use("/auth", authRouter);
expressServer.use("/sharing", sharingRouter);
expressServer.use("/app", ensureAuthenticated, appRoute);
expressServer.get("/keepAlive", (_, res) => {
  res.send(
    "<h1> Woahhh !! Didn't Expect To See You Here!! What You Doing In The Back Here? </h1>"
  );
});

// Start the shared server (both Express and Socket.io)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server Up on port ${PORT}`);
});

// Groq AI function
async function AskAIGroq(input) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You're a chatbot for a sticky notes site. Help users complete tasks or learn topics based on their 'TITLE|DESCRIPTION' inputs or any follow-up question without the mentioned format. Answer only related queries in a short, point-wise style. for code output, always mention the language you are providing code in.",
      },
      {
        role: "user",
        content: input,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 1.25,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
  });

  return chatCompletion.choices[0].message.content;
}
