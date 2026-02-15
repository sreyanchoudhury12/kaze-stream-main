import { Hash, ChevronDown, X, Plus } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

interface Channel {
  id: string;
  name: string;
  server_id: string;
}

interface Props {
  channels: Channel[];
  serverName?: string;
  activeChannelId: string;
  onChannelSelect: (id: string) => void;
  serverId: string;
  refreshChannels: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const ChannelSidebar: React.FC<Props> = ({
  channels,
  serverName,
  activeChannelId,
  onChannelSelect,
  serverId,
  refreshChannels,
  onClose,
  isMobile = false,
}) => {
  const [creating, setCreating] = useState(false);
  const [channelName, setChannelName] = useState("");

  const createChannel = async () => {
    if (!channelName.trim()) return;

    try {
      await axios.post(
        "import.meta.env.VITE_API_URL/api/channels",
        {
          name: channelName,
          server_id: serverId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setChannelName("");
      setCreating(false);
      refreshChannels();
    } catch (err) {
      
    }
  };

  return (
    <div className="flex h-full w-60 flex-shrink-0 flex-col bg-kaze-darker">

      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-border px-4 shadow-sm">
        <h2 className="truncate text-sm font-semibold text-foreground">
          {serverName ?? "Server"}
        </h2>

        <div className="flex items-center gap-2">
          <button onClick={() => setCreating(true)}>
            <Plus size={16} />
          </button>

          {isMobile && onClose && (
            <button onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelSelect(channel.id)}
            className={`group mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
              activeChannelId === channel.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-kaze-hover"
            }`}
          >
            <Hash size={16} />
            {channel.name}
          </button>
        ))}
      </div>

      {/* Create Channel Modal */}
      {creating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-black font-semibold mb-3">
              Create Channel
            </h2>
            <input
              className="w-full p-2 border mb-3 text-black"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel name"
            />
            <button
              onClick={createChannel}
              className="w-full bg-purple-600 text-white p-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelSidebar;
