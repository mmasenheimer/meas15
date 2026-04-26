const express = require("express");
const router = express.Router();
const { Group, UserToGroup } = require("../../../models");
const { User } = require("../../../models");
const { exec } = require("child_process");

router.post("/getActivity", async (req, res) => {
  const { start, destination } = req.body;

  exec(
    `py -3.13 ./src/algorithm/main.py "${start}" "${destination}"`,
    { timeout: 30000 },
    (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr });

      const lines = stdout.split('\n').filter(l => l.trim().startsWith('{'));
      const routes = lines.map(l => JSON.parse(l));
      res.json({ routes });
    },
  );
});

module.exports = router;
