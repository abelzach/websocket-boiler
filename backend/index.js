import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectMongoDB from "./connectMongo.js";
import { addMsgToConversation } from "./controllers/msg.controller.js";
import msgsRouter from "./routes/msg.route.js"
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]; 
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

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
    addMsgToConversation([msg.sender, msg.receiver], {
      text: msg.text,
      sender: msg.sender,
      receiver: msg.receiver,
    });
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

app.use('/msgs', msgsRouter);

// Start the server
server.listen(port, () => {
  connectMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
