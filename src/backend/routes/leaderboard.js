const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {});
// Get global leaderboard

router.get("/group/:groupId", (req, res) => {});
// Get leaderboard for a group, filter by group id

module.exports = router;
