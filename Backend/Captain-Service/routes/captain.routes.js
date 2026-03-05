import express from "express";
import { createCaptain,loginCaptain,getCaptainProfile,logoutCaptain,toggleAvailability } from "../controllers/captain.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/create-captain", createCaptain);
router.post("/login-captain", loginCaptain);
router.get("/captain-profile", authenticateToken, getCaptainProfile);
router.get("/logout", authenticateToken, logoutCaptain);
router.patch("/toggle-availability", authenticateToken, toggleAvailability);

export default router;