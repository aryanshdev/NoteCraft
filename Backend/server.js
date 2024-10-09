const express = require("express");
const app = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");
const { usersCol } = require("./db/dbconnection");
const ShortUniqueId = require("short-unique-id");
const { router: authRouter, ensureAuthenticated } = require("./routes/auth");
const sharingRouter = require("./routes/Sharing");
const helmet = require("helmet");
const chatServer = require("http").createServer(app);
const cors = require("cors");
const cookieParser = require("cookie-parser")
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const { Server } = require("socket.io");
const io = new Server(chatServer, {
  cors: {
    origin: [
      "https://notecraftai-xct5.onrender.com/",
      "https://notecraft-ai.netlify.app/",
    ], // Allow all origins or specify a list of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  },
});

io.listen(5656);
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
      .emit("USER", { message: message, name: socket.userName }); // to user joining the room
  });

  socket.on("shared_EDITFAV", (loggedName, nid) => {
    socket.broadcast.emit("shared_EDITFAV", loggedName, nid);
  });

  socket.on("ASKAI", async (message) => {
    socket.emit("SELF", "@NC-AI " + message.split("|")[1]); // to user joining the room
    socket.to(socket.roomID).emit("AIQUESTION", {
      message: "@NC-AI " + message.split("|")[1],
      name: socket.userName,
    });
    let reply = await AskAIGroq(message);
    io.to(socket.roomID).emit("AIMessage", {
      message: reply,
    });
  });
});
io.on("disconnection", () => {});

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "NoteCraft-AI",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: true, // Temporarily disable secure for testing
      sameSite: 'None', // Use a safer default value for now
    }
  })
);
app.use(helmet());

app.use(
  cors({
    origin: "https://notecraft-ai.onrender.com", // Frontend domain
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Required to send cookies
  })
);

idgen = new ShortUniqueId({ length: 15 });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://notecraftai-xct5.onrender.com/auth/google/process-login",
    },
    async (accessToken, refreshToken, profile, done) => {
      userData = await usersCol.findOne({ email: profile._json.email });
      if (userData) {
        return done(null, {
          userName: userData.name,
          loggedinUserUUID: userData.uuid,
          loggedUserEmail: profile._json.email,
        });
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile._json.email,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.picture,
        });
        return done(null, {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile._json.email,
        });
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://notecraftai-xct5.onrender.com/auth/github/process-login",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      userData = await usersCol.findOne({ email: profile.emails[0].value });
      if (userData) {
        return done(null, {
          userName: userData.name,
          loggedinUserUUID: userData.uuid,

          loggedUserEmail: profile.emails[0].value,
        });
      } else {
        let id = idgen.rnd();
        await usersCol.insertOne({
          email: profile.emails[0].value,
          name: profile._json.name,
          uuid: id,
          pfp: profile._json.avatar_url,
        });
        return done(null, {
          userName: profile._json.name,
          loggedinUserUUID: id,
          loggedUserEmail: profile.emails[0].value,
        });
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(10000, () => {
  console.log("Server Up");
});



app.use("/auth", authRouter);
app.use("/sharing", sharingRouter);
app.use("/app", ensureAuthenticated, appRoute);

async function AskAIGroq(input) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You're a chatbot for a sticky notes site. Help users complete tasks or learn topics based on their \"TITLE|DESCRIPTION\" inputs or a follow up question. Respond only to related follow-up queries; stictly ignore unrelated questions. answer In short - prefer pointwise style, if you think it's useless or some link or anything that you can't help with, reject it simply in the shortest message possible",
      },
      {
        role: "user",
        content: input,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });
  let reply = "";
  for await (const chunk of chatCompletion) {
    reply += chunk.choices[0]?.delta?.content || "";
  }
  return reply;
}
