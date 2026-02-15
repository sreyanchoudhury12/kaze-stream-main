import React, { useState } from "react";
import axios from "axios";

interface Server {
  id: string;
  name: string;
}

interface Props {
  servers: Server[];
  activeServerId: string;
  onServerSelect: (id: string) => void;
  onCreateServer: () => void; // 👈 from Dashboard
  logoSrc: string;
}

const ServerSidebar: React.FC<Props> = ({
  servers,
  activeServerId,
  onServerSelect,
  onCreateServer,
  logoSrc,
}) => {
  return (
    <div className="w-20 bg-[#1e1f22] flex flex-col items-center py-4">

      <img src={logoSrc} alt="logo" className="w-10 mb-4" />

      {servers.map((server) => (
        <button
          key={server.id}
          onClick={() => onServerSelect(server.id)}
          className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center text-white ${
            activeServerId === server.id
              ? "bg-purple-600"
              : "bg-gray-700"
          }`}
        >
          {server.name[0].toUpperCase()}
        </button>
      ))}

      {/* ➕ Create Server Button */}
      <button
        onClick={onCreateServer}
        className="w-12 h-12 rounded-full bg-green-600 text-white text-xl hover:bg-green-700 transition"
      >
        +
      </button>

    </div>
  );
};

export default ServerSidebar;
