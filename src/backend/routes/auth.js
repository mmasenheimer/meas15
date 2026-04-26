const express = require("express");
const router = express.Router();
const { User } = require("../../../models");

// POST /api/auth/login
// Body: { username, password }
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // TODO: hash password comparison (bcrypt) once you add hashing to register

  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ message: "Login successful", user });
});

// POST /api/auth/register
// Body: { username, email, password }
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res
      .status(400)
      .json({ error: "username, email, password required" });

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing)
    return res.status(409).json({ error: "Username or email already taken" });

  const user = await User.create({ username, email, password });
  res.status(201).json({ message: "Account created", user });
});

// POST /api/auth/forgot-password
// Body: { email }
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // TODO: send reset email

  res.json({ message: "If that email exists, a reset link has been sent." });
});

module.exports = router;
