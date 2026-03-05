import { Captain as CaptainModel } from "../models/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createCaptain = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
 
    const normalizedEmail = email.trim().toLowerCase();

    const existingCaptain = await CaptainModel.findOne({ email: normalizedEmail });
    if (existingCaptain) {
      return res.status(409).json({
        success: false,
        message: "Captain already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const captain = await CaptainModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Captain created successfully",
      data: captain,
    });

  } catch (error) {
    console.log("Error creating Captain:", error);

    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({
        success: false,
        message: "Captain already exists with this email",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create Captain",
    });
  }
}


const loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const captain = await CaptainModel.findOne({ email: normalizedEmail });

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, captain.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: captain._id,
      name: captain.name,
      email: captain.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const safeCaptain = {
      id: captain._id,
      name: captain.name,
      email: captain.email,
      createdAt: captain.createdAt,
      updatedAt: captain.updatedAt,
    };

    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    }).json({
      success: true,
      message: "Captain logged in successfully",
      data: safeCaptain,
      token: token
    });

  } catch (error) {
    console.log("Error logging in Captain:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login Captain",
    });
  }
}

const getCaptainProfile = async (req, res) => {
  try {
    const captainId = req.captain?.id || req.captain?._id;
    if (!captainId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const captain = await CaptainModel.findById(captainId).select("-password");
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Captain profile fetched successfully",
      data: captain,
    });


  } catch (error) {
    console.log("Error fetching Captain profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Captain profile",
    });

  }
}

const logoutCaptain = async (req, res) => {
  try {

    const captainId = req.captain?.id || req.captain?._id;
    
    if (!captainId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }).json({
      success: true,
      message: "Captain logged out successfully",
    });
    
  } catch (error) {
    console.log("Error logging out Captain:", error);
      res.status(500).json({
        success: false,
        message: "Failed to logout Captain",
      });

    
  }
}


const toggleAvailability = async (req, res) => {
  try {
    const captainId = req.captain?.id || req.captain?._id;
    
    if (!captainId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const captain = await CaptainModel.findById(captainId);

    

    if (!captain) {
      return res.status(404).json({
        success: false,
        message: "Captain not found",
      });
    }
    captain.isAvailable = !captain.isAvailable;

   const savedCaptain = await captain.save();
    console.log("savedCaptain",savedCaptain);

    
    res.status(200).json({
      success: true,
      message: "Captain availability toggled successfully",
      data: {
        id: savedCaptain._id,
        name: savedCaptain.name,
        isAvailable: savedCaptain.isAvailable,
      },
    });


    
  } catch (error) {
    console.log("Error toggling availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle availability",
    });
    
  }
}


    
export { createCaptain, loginCaptain, getCaptainProfile, logoutCaptain, toggleAvailability };
