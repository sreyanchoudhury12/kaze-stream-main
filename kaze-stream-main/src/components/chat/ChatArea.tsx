import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { createSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  username: string;
  channel_id: string;
  created_at: string;
}

interface Props {
  activeChannelId: string;
  onToggleChannels: () => void;
  onToggleMembers: () => void;
}

const ChatArea = ({ activeChannelId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);

  // 🔥 Create socket ONCE
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });


socket.on("user_online", (userId: string) => {
 
});

socket.on("user_offline", (userId: string) => {
  
});




    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔥 Join channel when channel changes
  useEffect(() => {
    if (!activeChannelId) return;

    // Fetch previous messages
    axios
      .get(`import.meta.env.VITE_API_URL/api/messages/${activeChannelId}`)
      .then((res) => {
        setMessages(res.data);
      });

    // Join socket room
    socketRef.current?.emit("join_channel", activeChannelId);

  }, [activeChannelId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      content: newMessage,
      channel_id: activeChannelId,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col flex-1 bg-background text-white p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <div className="text-sm font-semibold text-purple-400">
              {msg.username}
            </div>

            <div className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>

            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 p-2 text-black rounded-l"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
