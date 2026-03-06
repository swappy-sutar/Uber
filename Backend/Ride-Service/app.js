import express from "express";
import rideRoutes from "./routes/ride.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Uber ride-Service backend app is running",
  });
});

app.use("/", rideRoutes);

export { app };