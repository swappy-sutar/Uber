import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { connectDB } from "./config/db_connections.js";
import { app } from "./app.js";


connectDB();

const server = http.createServer(app);

server.listen(process.env.CAPTAIN_SERVICE_PORT, () => {
  console.log(`Captain service is running on port ${process.env.CAPTAIN_SERVICE_PORT}`);
})