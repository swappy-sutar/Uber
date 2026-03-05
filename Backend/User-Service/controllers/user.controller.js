import { User } from "../models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
}


const loginUser = async (req, res) => {
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
    console.log("normalizedEmail:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });

    console.log("user:", user);
    

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    }).json({
      success: true,
      message: "User logged in successfully",
      data: safeUser,
      token: token
    });

  } catch (error) {
    console.log("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login user",
    });
  }
}

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });


  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });

  }
}

const logoutUser = async (req, res) => {
  try {

    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
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
      message: "User logged out successfully",
    });
    
  } catch (error) {
    console.log("Error logging out user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to logout user",
      });

    
  }
}


    
export { createUser, loginUser, getUserProfile, logoutUser };
