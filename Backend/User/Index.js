import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { connectDB } from "./config/db_connections.js";
import { app } from "./app.js";


connectDB();

const server = http.createServer(app);

server.listen(process.env.USER_SERVICE_PORT, () => {
  console.log(`User service is running on port ${process.env.USER_SERVICE_PORT}`);

})