const express = require("express");
const router = express.Router();
const { User } = require("../../../models");
export default function Map({ user }) {

// GET /api/profile?userId=...
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /api/profile/logout
router.post("/logout", async (req, res) => {
  const { userId } = req.body;

  await User.findByIdAndUpdate(userId, { isLoggedIn: false });
  res.json({ message: "Logged out" });
});

// POST /api/profile/addPoints
// Body: { userId, points }
router.post("/addPoints", async (req, res) => {
  try {
    const { userId, points } = req.body;

    if (!userId || points === undefined)
      return res.status(400).json({ error: "userId and points required" });

    const parsed = parseInt(points);
    if (isNaN(parsed))
      return res.status(400).json({ error: "points must be a number" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: parsed } },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Points updated", points: user.points });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
