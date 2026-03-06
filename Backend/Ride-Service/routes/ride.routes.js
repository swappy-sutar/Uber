import express from "express";
import { createRide,loginRide,getRideProfile,logoutRide } from "../controllers/ride.controller.js";
import { authenticateToken } from "../middlewares/ride.middleware.js";


const router = express.Router();

router.post("/create-ride", createRide);
router.get("/ride-update", authenticateToken, getRideProfile);
router.get("/logout", authenticateToken, logoutRide);
router.delete("/delete-ride", authenticateToken, logoutRide);

export default router;