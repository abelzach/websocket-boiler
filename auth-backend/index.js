import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongo.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.route.js";

dotenv.config();

const app = express();
// Enable CORS for all origins for testing

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

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
// any requests whose path starts with /auth will be routed to the authRouter middleware for further processing
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Define a route
app.get("/", (req, res) => {
  res.send("AuthServer!");
});

// Start the server
app.listen(port, () => {
  connectMongoDB();
  console.log(`Auth Server is listening at http://localhost:${port}`);
});
