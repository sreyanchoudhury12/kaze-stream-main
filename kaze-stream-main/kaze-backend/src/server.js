require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { connectDB } = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Create Express app
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Kaze Chat Backend Running 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// Socket Logic
io.on("connection", (socket) => {


  socket.on("join_channel", (channelId) => {
    socket.join(channelId);
    
  });

  socket.on("send_message", (messageData) => {
    io.to(messageData.channel_id).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
   
  });
});

// Connect Database then Start Server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      
    });
  })
  .catch((err) => {
   console.error("Server creation error:", err);
  });
const serverRoutes = require("./routes/serverRoutes");
app.use("/api/servers", serverRoutes);


