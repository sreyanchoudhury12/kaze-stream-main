const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    
  } catch (err) {
    
    process.exit(1);
  }
};

module.exports = { pool, connectDB };

