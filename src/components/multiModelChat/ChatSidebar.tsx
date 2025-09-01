import React from 'react';

interface Chat {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatSidebarProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
  onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  onSelectChat,
  currentChatId,
  onNewChat,
}) => {
  return (
    <div className="w-1/4 h-full bg-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 m-0">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      {/* New Conversation Button */}
      <button
        onClick={onNewChat}
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Conversation
      </button>

      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-2 rounded cursor-pointer ${currentChatId === chat.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
