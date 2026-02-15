const express = require("express");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");


const router = express.Router();

// 🔐 Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Create server
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Server name required" });
    }

    // Create server
    const serverResult = await pool.query(
      "INSERT INTO servers (name, owner_id) VALUES ($1, $2) RETURNING *",
      [name, req.user.id]
    );

    const newServer = serverResult.rows[0];

    // Add creator as member
    await pool.query(
      "INSERT INTO server_members (user_id, server_id) VALUES ($1, $2)",
      [req.user.id, newServer.id]
    );

    // 🔥 Auto-create default channel
    await pool.query(
      "INSERT INTO channels (name, server_id) VALUES ($1, $2)",
      ["general", newServer.id]
    );

    res.status(201).json(newServer);

  } catch (err) {
    
    res.status(500).json({ message: "Server creation failed" });
  }
});

// ✅ Get all servers for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT s.*
      FROM servers s
      JOIN server_members sm ON sm.server_id = s.id
      WHERE sm.user_id = $1
      ORDER BY s.created_at ASC
      `,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    
    res.status(500).json({ message: "Failed to fetch servers" });
  }
});

module.exports = router;
