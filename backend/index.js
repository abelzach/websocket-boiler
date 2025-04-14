import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

// Define a map to store username-to-socket mappings
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client connected");
  const username = socket.handshake.query.username;
  console.log("Username:", username);

  // Store the socket in the map
  userSocketMap[username] = socket;

  socket.on("chat-msg", (msg) => {
    console.log("message:", msg);
    const receiverSocket = userSocketMap[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit("chat-msg", msg);
    }
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (username) {
      delete userSocketMap[username];
    }
  });
});

// Define a route
app.get("/", (req, res) => {
  res.send("Websocket!");
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
