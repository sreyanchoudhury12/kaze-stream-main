const { pool } = require("../config/db");

exports.createChannel = async (req, res) => {
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
};

exports.getChannels = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM channels ORDER BY created_at ASC"
    );

    res.json(result.rows);
  } catch (err) {
    
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};
