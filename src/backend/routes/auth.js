const express = require("express");
const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // TODO: look up user in DB and verify password
});

router.post("/register", (req, res) => {});
router.post("/forgot-password", (req, res) => {});

module.exports = router;
