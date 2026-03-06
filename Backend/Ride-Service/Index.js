import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { connectDB } from "./config/db_connections.js";
import { app } from "./app.js";


connectDB();

const server = http.createServer(app);

server.listen(process.env.RIDE_SERVICE_PORT, () => {
  console.log(`Ride service is running on port ${process.env.RIDE_SERVICE_PORT}`);

})