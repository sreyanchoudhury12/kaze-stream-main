export interface Server {
  id: string;
  name: string;
  icon: string;
}

export interface Channel {
  id: string;
  name: string;
  serverId: string;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  channelId: string;
}

export interface Member {
  id: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  role?: string;
}

export const servers: Server[] = [
  { id: "s1", name: "Kaze HQ", icon: "K" },
  { id: "s2", name: "Gaming Zone", icon: "G" },
  { id: "s3", name: "Dev Team", icon: "D" },
  { id: "s4", name: "Music Lounge", icon: "M" },
  { id: "s5", name: "Art Studio", icon: "A" },
];

export const channels: Channel[] = [
  { id: "c1", name: "general", serverId: "s1" },
  { id: "c2", name: "announcements", serverId: "s1" },
  { id: "c3", name: "off-topic", serverId: "s1" },
  { id: "c4", name: "gaming", serverId: "s1" },
  { id: "c5", name: "valorant", serverId: "s2" },
  { id: "c6", name: "league", serverId: "s2" },
  { id: "c7", name: "cs2", serverId: "s2" },
  { id: "c8", name: "frontend", serverId: "s3" },
  { id: "c9", name: "backend", serverId: "s3" },
  { id: "c10", name: "chill-beats", serverId: "s4" },
  { id: "c11", name: "showcase", serverId: "s5" },
];

export const members: Member[] = [
  { id: "u1", username: "KazeBot", avatar: "KB", status: "online", role: "Bot" },
  { id: "u2", username: "StormRider", avatar: "SR", status: "online" },
  { id: "u3", username: "NightFury", avatar: "NF", status: "online" },
  { id: "u4", username: "CyberViper", avatar: "CV", status: "idle" },
  { id: "u5", username: "PhantomX", avatar: "PX", status: "dnd" },
  { id: "u6", username: "SkyWalker", avatar: "SW", status: "online" },
  { id: "u7", username: "BlazeMaster", avatar: "BM", status: "offline" },
  { id: "u8", username: "IronClad", avatar: "IC", status: "offline" },
  { id: "u9", username: "QuantumLeap", avatar: "QL", status: "offline" },
];

export const initialMessages: Message[] = [
  {
    id: "m1", userId: "u1", username: "KazeBot", avatar: "KB",
    content: "Welcome to Kaze Chat! ⚡ The wind is at your back.",
    timestamp: "Today at 10:00 AM", channelId: "c1",
  },
  {
    id: "m2", userId: "u2", username: "StormRider", avatar: "SR",
    content: "Hey everyone! Ready for tonight's tournament?",
    timestamp: "Today at 10:05 AM", channelId: "c1",
  },
  {
    id: "m3", userId: "u3", username: "NightFury", avatar: "NF",
    content: "Absolutely! Let's dominate 🔥",
    timestamp: "Today at 10:07 AM", channelId: "c1",
  },
  {
    id: "m4", userId: "u6", username: "SkyWalker", avatar: "SW",
    content: "I've been practicing all week. This is our time!",
    timestamp: "Today at 10:12 AM", channelId: "c1",
  },
  {
    id: "m5", userId: "u4", username: "CyberViper", avatar: "CV",
    content: "Anyone want to run some warm-up matches?",
    timestamp: "Today at 10:15 AM", channelId: "c1",
  },
  {
    id: "m6", userId: "u2", username: "StormRider", avatar: "SR",
    content: "Count me in. Let's go 💨",
    timestamp: "Today at 10:16 AM", channelId: "c1",
  },
];
