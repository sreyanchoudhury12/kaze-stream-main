const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {

  // 🔐 Authenticate socket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
   

    // 🟢 Mark online
    onlineUsers.set(socket.userId, socket.id);

    io.emit("user_online", socket.userId);

    socket.on("join_channel", (channelId) => {
      socket.join(channelId);
    });

    socket.on("send_message", async ({ content, channel_id }) => {
      try {
        const result = await pool.query(
          `
          INSERT INTO messages (content, channel_id, sender_id)
          VALUES ($1, $2, $3)
          RETURNING *
          `,
          [content, channel_id, socket.userId]
        );

        const message = result.rows[0];

        const user = await pool.query(
          "SELECT username FROM users WHERE id = $1",
          [socket.userId]
        );

        io.to(channel_id).emit("receive_message", {
          ...message,
          username: user.rows[0].username,
        });

      } catch (err) {
        
      }
    });

    socket.on("disconnect", () => {
     

      onlineUsers.delete(socket.userId);

      io.emit("user_offline", socket.userId);
    });
  });
};
