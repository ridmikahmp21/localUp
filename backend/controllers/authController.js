const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Register 
exports.registerUser = async (req, res) => {
  console.log("Incoming registration data:", req.body);
  try {
    let { name, email, username, password, role, phone, address } = req.body;

    if (!role || !["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Valid role is required" });
    }
    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Name and password are required" });
    }

    email = email ? email.trim().toLowerCase() : undefined;
    username = username ? username.trim().toLowerCase() : undefined;

    if (role === "buyer") {
      if (!email || !phone || !address) {
        return res
          .status(400)
          .json({
            message: "Email, phone, and address are required for buyer",
          });
      }
    }
    if (role === "seller" && !username) {
      return res
        .status(400)
        .json({ message: "Username is required for seller" });
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: "Email already in use" });
    }
    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists)
        return res.status(400).json({ message: "Username already in use" });
    }

    const userData = {
      name,
      email,
      password,
      role,
      phone,
      address,
    };

    if (username) {
      userData.username = username;
    }
    const user = await User.create(userData);

    if (role === "buyer" && email) {
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr.message);
      }
    }

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email || null,
        username: user.username || null,
        phone: user.phone || null,
        address: user.address || null,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login (buyers via email, sellers via username)
exports.loginUser = async (req, res) => {
  try {
    const { role } = req.body || {};
    if (!role || !["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Valid role is required" });
    }

    let user;
    if (role === "seller") {
      const { username, password } = req.body || {};
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }
      const normalizedUsername = username.trim().toLowerCase();

      user = await User.findOne({
        username: normalizedUsername,
        role: "seller",
      });
      if (!user)
        return res
          .status(401)
          .json({ message: "Invalid username or password" });

      const ok = await user.matchPassword(password);
      if (!ok)
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
    } else {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const normalizedEmail = email.trim().toLowerCase();

      user = await User.findOne({ email: normalizedEmail, role: "buyer" });
      if (!user)
        return res.status(401).json({ message: "Invalid email or password" });

      const ok = await user.matchPassword(password);
      if (!ok)
        return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email || null,
        username: user.username || null,
        phone: user.phone || null,
        address: user.address || null,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, gender } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address, gender },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
