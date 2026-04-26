const express = require("express");
const router = express.Router();
const { Group, UserToGroup } = require("../../../models");

// POST /api/groups/create
// Body: { userId, name }
router.post("/create", async (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name)
    return res.status(400).json({ error: "userId and name required" });

  const alreadyInGroup = await UserToGroup.findOne({ userId });

  if (alreadyInGroup)
    return res.status(409).json({
      error: "User already in a group. Leave your current group first.",
    });

  const group = await Group.create({ name });

  // automatically add the creator to the group
  await UserToGroup.create({ userId, groupId: group._id });

  res.status(201).json({ message: "Group created", group });
});

router.post("/getAll", async (req, res) => {
  try {
    const users = await Group.find({});
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups/join
// Body: { userId, groupId }
router.post("/join", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId)
    return res.status(400).json({ error: "userId and groupId required" });

  const alreadyInGroup = await UserToGroup.findOne({ userId });
  if (alreadyInGroup)
    return res.status(409).json({
      error: "User already in a group. Leave your current group first.",
    });

  const existing = await UserToGroup.findOne({ userId, groupId });

  if (existing)
    return res.status(409).json({ error: "User already in this group" });

  await UserToGroup.create({ userId, groupId });
  res.json({ message: "Joined group" });
});

// POST /api/groups/leave
// Body: { userId, groupId }
router.post("/leave", async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || !groupId)
    return res.status(400).json({ error: "userId and groupId required" });

  const membership = await UserToGroup.findOne({ userId, groupId });
  if (!membership)
    return res.status(404).json({ error: "User is not in this group" });

  await membership.deleteOne();
  res.json({ message: "Left group" });
});

module.exports = router;
