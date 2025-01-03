import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";

const app = express();

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Uber backend app is running",
    });
})


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };