const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Send message
router.post("/", async (req, res) => {
  try {
    const { content, channel_id, sender_id } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (content, channel_id, sender_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [content, channel_id, sender_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
   
    res.status(500).json({ message: "Message send failed" });
  }
});

// Get messages by channel





router.get("/:channelId", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE channel_id = $1
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [req.params.channelId]
    );

    // Reverse so newest appear at bottom
    res.json(result.rows.reverse());

  } catch (err) {
   
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});



module.exports = router;












