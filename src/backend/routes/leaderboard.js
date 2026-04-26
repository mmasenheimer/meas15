const express = require("express");
const router = express.Router();
const { User, UserToGroup } = require("../../../models");

// GET /api/leaderboard/global
// All users ranked by points
router.get("/global", async (req, res) => {
  const users = await User.find()
    .select("username points")
    .sort({ points: -1 });
  res.json(users);
});

// GET /api/leaderboard/group/:groupId
// Users in a specific group ranked by points
router.get("/group/:groupId", async (req, res) => {
  const memberships = await UserToGroup.find({
    groupId: req.params.groupId,
  }).populate("userId", "username points");
  const ranked = memberships
    .map((m) => m.userId)
    .sort((a, b) => b.points - a.points);
  res.json(ranked);
});

// GET /api/leaderboard/groups
// All groups ranked by combined points of their members
router.get("/groups", async (req, res) => {
  const memberships = await UserToGroup.find()
    .populate("userId", "points")
    .populate("groupId", "name");

  // Sum points per group
  const totals = {};
  for (const m of memberships) {
    const id = m.groupId._id.toString();
    if (!totals[id]) totals[id] = { group: m.groupId, points: 0 };
    totals[id].points += m.userId.points;
  }

  const ranked = Object.values(totals).sort((a, b) => b.points - a.points);
  res.json(ranked);
});

module.exports = router;
