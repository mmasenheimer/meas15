const express = require("express");
const router = express.Router();
const { Group, UserToGroup } = require("../../../models");
const { User } = require("../../../models");
const { exec } = require("child_process");

router.post("/getActivity", async (req, res) => {
  const { start, destination } = req.body;

  exec(
    `python3 ./src/algorithm/main.py "${start}" "${destination}"`,
    (err, stdout, stderr) => {
      if (err) return res.status(500).json({ error: stderr });

      const result = JSON.parse(stdout);
      console.log(result);

      res.json(result);
    },
  );
});
