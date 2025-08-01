const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const generateTokens = require("../config/generateToken");

const router = express.Router();

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { accessToken } = generateTokens(user._id);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/token" });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
