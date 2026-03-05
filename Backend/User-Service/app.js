import express from "express";
import userRoutes from "./routes/user.routes.js";




const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Uber backend app is running",
  });
});

app.use("/", userRoutes);





export { app };