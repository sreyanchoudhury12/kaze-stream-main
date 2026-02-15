require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");
const serverRoutes = require("./routes/serverRoutes");

const app = express();
const server = http.createServer(app);

/* ==============================
   MIDDLEWARE
============================== */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* ==============================
   ROUTES
============================== */

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/servers", serverRoutes);

app.get("/", (req, res) => {
  res.send("Kaze Chat Backend Running 🚀");
});

/* ==============================
   SOCKET.IO
============================== */

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_channel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("send_message", (messageData) => {
    io.to(messageData.channel_id).emit("receive_message", messageData);
  });
});

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("✅ Database Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
