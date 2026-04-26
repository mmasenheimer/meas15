require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .then(() =>
    console.log(`┌─┐┌─┐┌─┐┌┬┐┌─┐┌─┐
├┤ │  │ ││││├─┤├─┘
└─┘└─┘└─┘┴ ┴┴ ┴┴ `),
  )
  .catch((err) => console.error(err));

app.use("/api/auth", require("./src/backend/routes/auth"));
app.use("/api/profile", require("./src/backend/routes/profile"));
app.use("/api/routes", require("./src/backend/routes/routes"));
app.use("/api/leaderboard", require("./src/backend/routes/leaderboard"));

app.listen(3000, () => console.log("http://localhost:3000"));
