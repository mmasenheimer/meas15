const express = require("express");
const router = express.Router();

const handleNewActivity = () => {
  const now = new Date();

  const timeOnly = now.toTimeString().split(" ")[0];
  const dateOnly = now.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  const payload = {
    date: dateOnly,
    time: timeOnly,
  };

  console.log(payload);
  // then send to backend:
  // fetch('/api/routes/start', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
};
