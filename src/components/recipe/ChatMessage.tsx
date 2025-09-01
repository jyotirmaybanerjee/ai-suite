import React from 'react';

interface ChatMessageProps {
  sender: 'user' | 'ai';
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 max-w-lg rounded-lg shadow-md ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
