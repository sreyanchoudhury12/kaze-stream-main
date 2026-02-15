import { io, Socket } from "socket.io-client";

export const createSocket = (): Socket => {
  const token = localStorage.getItem("token");

  return io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
  });
};

