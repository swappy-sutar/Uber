import express from "express";
import { createUser,loginUser,getUserProfile,logoutUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/create-user", createUser);
router.post("/login-user", loginUser);
router.get("/user-profile", authenticateToken, getUserProfile);
router.post("/logout", authenticateToken, logoutUser);


export default router;