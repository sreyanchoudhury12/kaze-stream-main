import React from "react";

interface Props {
  onlineUsers: string[];
}

interface Member {
  id: string;
  username: string;
}

// Temporary mock members (replace later with real DB data)
const members: Member[] = [
  { id: "1", username: "User1" },
  { id: "2", username: "User2" },
  { id: "3", username: "User3" },
];

const MembersSidebar = ({ onlineUsers }: Props) => {
  return (
    <div className="w-60 bg-[#1e1f22] p-4 text-white">
      <h2 className="text-sm font-semibold mb-4 text-gray-400">
        Members
      </h2>

      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              onlineUsers.includes(member.id)
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          />
          <span>{member.username}</span>
        </div>
      ))}
    </div>
  );
};

export default MembersSidebar;
