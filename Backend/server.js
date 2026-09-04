const express = require("express");
const expressServer = express();
const appRoute = require("./routes/app");
const bodyParser = require("body-parser");
const passport = require("passport");
const { usersCol } = require("./db/dbconnection");
const ShortUniqueId = require("short-unique-id");
const { router: authRouter, ensureAuthenticated } = require("./routes/auth");
const sharingRouter = require("./routes/Sharing");
const helmet = require("helmet");
const cors = require("cors");
const Groq = require("groq-sdk");
const http = require("http"); // Create HTTP server
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = http.createServer(expressServer); // Attach Express to the server
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const idgen = new ShortUniqueId({ length: 15 });

// Socket.io server
const io = new Server(app, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2.5 * 60 * 1000,
    skipMiddlewares: true,
  },
  cors: {
    origin: ["https://notecraftai-xct5.onrender.com/", "https://notecraft-ai.onrender.com"],
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
    socket.emit("CONNEST", 200);
    socket.to(roomID).emit("SYSTEM", `${name} has joined the room`); // to everyone else
  });

  socket.on("UserToServer", (message) => {
    socket
      .to(socket.roomID)
      .emit("USER", { message: message, name: socket.userName });
  });

  socket.on("ASKAI", async (messages) => {
    let reply = await AskAIGroq(messages);
    io.to(socket.roomID).emit("AIMessage", { message: reply });
  });
  socket.on("ASKAITASK", async (messages) => {
    let reply = await AskAIGroq(messages, true);
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

io.on("disconnection", () => {
  socket.broadcast.emit("SYSTEM", `${socket.userName} has left the room`);
});

// Middleware and security settings
expressServer.use(bodyParser.json());
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use(cookieParser());

expressServer.use(helmet());

expressServer.use(
  cors({
    origin: ["https://notecraft-ai.onrender.com"], // Frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    origin: true,
  })
);

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
async function AskAIGroq(inputs, onlyTask = false) {
  if (!onlyTask) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Name: NoteCraft-AI Assistant. Role: Sticky notes chatbot helper to only tell optimized way to complete task nothing more. Rules: Use code blocks for code examples/commands and mention programming language used, Be concise & avoid repetition",
        },
        ...inputs.map((inp) => ({
          role:
            inp[0] === "SELF"
              ? "user"
              : inp[0] === "AI"
              ? "assistant"
              : "system",
          content: inp[1],
        })),
      ],
      model="openai/gpt-oss-120b",
      temperature: 1.25,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });
    return chatCompletion.choices[0].message.content;
  } else {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Name: NoteCraft-AI Assistant. Role: Sticky notes chatbot helper to help user in their daily tasks and coding problems. Rules: Use code blocks for code examples/commands and mention programming language used, Be concise & avoid repetition",
        },
        {
          role: "user",
          content: inputs,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 1.25,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });
    return chatCompletion.choices[0].message.content;
  }

  return chatCompletion.choices[0].message.content;
}
