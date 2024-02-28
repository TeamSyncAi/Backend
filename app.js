import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import chatroomRoutes from "./routes/chatRoomRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import { Server } from "socket.io"; // Import socket.io
import usersRoutes from "./routes/userRoutes.js";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/TeamSyncAI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/chatrooms", chatroomRoutes);
app.use("/messages", messageRoutes);
app.use("/users", usersRoutes);

app.use(notFoundError);
app.use(errorHandler);

const server = app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const io = new Server(server);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //Get the chatID of the user and join in a room of the same chatID
  const chatID = socket.handshake.query.chatID;
  socket.join(chatID);
  //when connect
  console.log("a user connected.");

  console.log(socket.id);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    console.log(users);
  });

  socket.on("newMessage1", (data) => {
    const messageData = JSON.parse(data);

    // Broadcast the received message to all connected clients
    io.emit("newMessage1", {
      message: messageData.message,
      senderUsername: messageData.senderUsername,
      sentAt: messageData.sentAt,
    });
  });

  //send and get message
  socket.on("send_message", (message) => {
    const receiverChatID = message.receiverChatID;
    const senderChatID = message.senderChatID;
    const content = message.content;

    socket.in(receiverChatID).emit("receive_message", {
      content: content,
      senderChatID: senderChatID,
      receiverChatID: receiverChatID,
    });
    const user = getUser(receiverChatID);

    if (user != null) {
      io.to(user.socketId).emit("getMessage", message);
    } else {
      console.log("user not connected");
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
