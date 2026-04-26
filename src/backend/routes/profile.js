const express = require("express");
const router = express.Router();
const { User } = require("../../../models");

// GET /api/profile?userId=...
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// PATCH /api/profile
// Body: { userId, username }
router.patch("/", async (req, res) => {
  const { userId, username } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    { username },
    { new: true },
  ).select("-password");
  res.json(user);
});

// POST /api/profile/logout
router.post("/logout", (req, res) => {
  // Frontend just clears its stored user — nothing to do server-side without sessions/JWT
  res.json({ message: "Logged out" });
});

module.exports = router;
