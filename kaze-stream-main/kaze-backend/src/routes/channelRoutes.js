const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Create channel
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      "INSERT INTO channels (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
   
    res.status(500).json({ message: "Channel creation failed" });
  }
});

// Get all channels
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM channels ORDER BY created_at ASC");
    res.json(result.rows);
  } catch (err) {
    
    res.status(500).json({ message: "Failed to fetch channels" });
  }


router.get("/:serverId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM channels WHERE server_id = $1 ORDER BY created_at ASC",
      [req.params.serverId]
    );

    res.json(result.rows);
  } catch (err) {
   
    res.status(500).json({ message: "Failed to fetch channels" });
  }
});




});

module.exports = router;

