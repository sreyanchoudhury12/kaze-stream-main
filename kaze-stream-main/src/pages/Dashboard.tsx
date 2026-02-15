import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Socket } from "socket.io-client";
import { createSocket } from "@/lib/socket";

import ServerSidebar from "@/components/chat/ServerSidebar";
import ChannelSidebar from "@/components/chat/ChannelSidebar";
import ChatArea from "@/components/chat/ChatArea";
import MembersSidebar from "@/components/chat/MembersSidebar";
import kazeLogo from "@/assets/kaze-logo.png";

interface Server {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
  server_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeServerId, setActiveServerId] = useState<string>("");
  const [activeChannelId, setActiveChannelId] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showChannels, setShowChannels] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // 🔐 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🌐 Socket setup
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("user_online", (userId: string) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    socket.on("user_offline", (userId: string) => {
      setOnlineUsers((prev) =>
        prev.filter((id) => id !== userId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 📡 Fetch servers
  const fetchServers = async () => {
    try {
      const token = localStorage.getItem("token");   
      const res = await axios.get<Server[]>(
        "import.meta.env.VITE_API_URL/api/servers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServers(res.data);

      if (res.data.length > 0) {
        setActiveServerId(res.data[0].id);
      }
    } catch (err) {
     
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // 📡 Fetch channels
  const fetchChannels = async () => {
    if (!activeServerId) return;

    try {
      const res = await axios.get<Channel[]>(
        `import.meta.env.VITE_API_URL/api/channels/${activeServerId}`
      );

      setChannels(res.data);

      if (res.data.length > 0) {
        setActiveChannelId(res.data[0].id);
      }
    } catch (err) {
      
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [activeServerId]);

  // ➕ Create server
  const createServer = async () => {
    const name = prompt("Enter server name");
    if (!name) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "import.meta.env.VITE_API_URL/api/servers",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newServer = res.data;

      setServers((prev) => [...prev, newServer]);
      setActiveServerId(newServer.id);
    } catch (err) {
     
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">

      {/* Server Sidebar */}
      <div className="hidden sm:flex">
        <ServerSidebar
          servers={servers}
          activeServerId={activeServerId}
          onServerSelect={setActiveServerId}
          onCreateServer={createServer}
          logoSrc={kazeLogo}
        />
      </div>

      {/* Channel Sidebar */}
      <div className="hidden lg:flex">
        <ChannelSidebar
          channels={channels}
          serverName={servers.find(s => s.id === activeServerId)?.name}
          activeChannelId={activeChannelId}
          onChannelSelect={setActiveChannelId}
          serverId={activeServerId}
          refreshChannels={fetchChannels}
        />
      </div>

      <ChatArea
        activeChannelId={activeChannelId}
        onToggleChannels={() => setShowChannels(true)}
        onToggleMembers={() => setShowMembers(true)}
      />

      <div className="hidden md:flex">
        <MembersSidebar onlineUsers={onlineUsers} />
      </div>

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>

    </div>
  );
};

export default Dashboard;
