import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";
import agentRoutes from "./routes/agents.js";
import agentGroupRoutes from "./routes/agentGroups.js";
import scenarioGroupRoutes from "./routes/scenarioGroups.js";
import scenarioRoutes from "./routes/scenarios.js";


const app = express();
dotenv.config();

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("connect to mongodb database");
    })
    .catch((err) => {
      throw err;
    });
};
app.use(cors());
app.use(cookieParser());
app.use(express.json());



app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/agentGroups", agentGroupRoutes);
app.use("/api/scenarios", scenarioRoutes);
app.use("/api/scenarioGroups", scenarioGroupRoutes);

app.listen(8000, () => {
  connect();
  console.log("Listening to port 8000");
});
