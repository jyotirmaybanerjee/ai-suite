import React, { FormEvent } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: number;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: (e: FormEvent) => Promise<void>;
  selectedModel: string;
  handleSelectModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  models: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  userInput,
  setUserInput,
  handleSendMessage,
  selectedModel,
  handleSelectModel,
  models,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full p-4 bg-white">
      {/* Model Selection */}
      <div className="mb-4">
        <label className="mr-2 text-gray-700">Select Model:</label>
        <select
          value={selectedModel}
          onChange={handleSelectModel}
          className="p-2 border rounded-md"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={`${msg.id}-${msg.createdAt}`}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 max-w-lg rounded-lg shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center py-4 text-gray-500">Thinking...</div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isLoading}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
