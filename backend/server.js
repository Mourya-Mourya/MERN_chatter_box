const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello babe");
});

/* app.get("/api/chat", (req, res) => {
  res.send(chats);
  console.log(chats);
});

// let see only for single chat.

app.get("/api/chat/:id", (req, res) => {
  const id = req.params.id;
  const chat = chats.find((c) => c._id == id);
  res.send(chat);
}); */

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// this below function is to handle error if they use wroing apis
app.use(notFound);
app.use(errorHandler);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  // here we are connecting server directory to frontend build folder index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const PORT = process.env.PORT || 5000;

/* app.listen(PORT, () => {
  console.log(`listening on port number ${PORT}`.yellow.bold);
}); */

const server = app.listen(PORT, () => {
  console.log(`listening on port number ${PORT}`.yellow.bold);
});
// here we are setting to vaiable bcz we will be using that again and again in the code so.
// here we will setup socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000, // if user does not connect withing 60 sec user wll close connection
  cors: {
    origin: "http://localhost:3000",
  },
});

// creates a connection
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  //creating a new room from frontend so that they can come and connect. it is only for particular user.
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // to join a chat.
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // for typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // for new message.
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
      // now this newMessageRecieved like for which chat or user it belongs all those logics are written in frontend.
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
