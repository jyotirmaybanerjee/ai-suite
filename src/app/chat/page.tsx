'use client';
import React from 'react';
import ChatSidebar from '@/components/multiModelChat/ChatSidebar';
import ChatWindow from '@/components/multiModelChat/ChatWindow';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

interface Chat {
  id: string;
  title: string;
  createdAt: number;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: number;
}

const MODELS = ['gemini', 'mistral'];

export default function MultiModelChat() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0]);

  // Load all chat sessions from Firestore
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const chats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];
        setAllChats(chats);

        // Load the first chat's messages if it exists
        if (chats.length > 0) {
          setCurrentChatId(chats[0].id);
        }
      } catch (e) {
        console.error('Error fetching chats:', e);
      }
    };
    fetchChats();
  }, []);

  // Load messages for the current chat
  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const q = query(
          collection(db, 'chats', currentChatId, 'messages'),
          orderBy('createdAt')
        );
        const querySnapshot = await getDocs(q);
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(msgs);
      } catch (e) {
        console.error('Error fetching messages:', e);
      }
    };
    fetchMessages();
  }, [currentChatId]);

  // Optimized chat submission handler using useCallback
  const handleSendMessage = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!userInput.trim()) return;

      setIsLoading(true);

      const userMessage: Message = {
        id: '', // Firestore will provide this
        sender: 'user',
        text: userInput,
        createdAt: Date.now(),
      };

      // Add user message to local state immediately for a smooth UI
      setMessages((prev) => [...prev, userMessage]);
      setUserInput('');

      let currentChatRef;
      let newChatCreated = false;

      // Create a new chat if one isn't selected
      if (!currentChatId) {
        const chatData = {
          title: userInput.substring(0, 30) + '...',
          createdAt: Date.now(),
        };
        const newChatDocRef = await addDoc(collection(db, 'chats'), chatData);
        currentChatRef = newChatDocRef;
        setCurrentChatId(newChatDocRef.id);
        newChatCreated = true;
      } else {
        currentChatRef = doc(db, 'chats', currentChatId);
      }

      // Save the user message to Firestore
      await addDoc(collection(currentChatRef, 'messages'), userMessage);

      try {
        // --- THIS IS THE UPDATED SECTION ---
        const apiBaseUrl = process.env.NEXT_PUBLIC_TRAVEL_API;
        if (!apiBaseUrl) {
          throw new Error(
            'NEXT_PUBLIC_TRAVEL_API is not defined in environment variables.'
          );
        }
        // Construct the full URL to your backend endpoint
        const response = await fetch(`${apiBaseUrl}/multimodelchat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: selectedModel, prompt: userInput }),
        });

        if (!response.ok) {
          // Parse the error message from your backend if available
          const errorData = await response.json();
          throw new Error(errorData.message || 'Unknown API error');
        }

        const aiResponseData = await response.json();

        const aiMessage: Message = {
          id: '',
          sender: 'ai',
          text: aiResponseData.result,
          createdAt: Date.now(),
        };

        // Save the AI message to Firestore
        await addDoc(collection(currentChatRef, 'messages'), aiMessage);

        // Update local state and the list of chats
        setMessages((prev) => [
          ...prev.filter(
            (m) => m.sender === 'user' && m.text === userMessage.text
          ),
          aiMessage,
        ]);

        if (newChatCreated) {
          setAllChats((prev) => [
            {
              id: currentChatRef.id,
              title: userInput.substring(0, 30) + '...',
              createdAt: Date.now(),
            },
            ...prev,
          ]);
        }
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            id: '',
            sender: 'ai',
            text: 'Error: Could not get a response.',
            createdAt: Date.now(),
          },
        ]);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [userInput, currentChatId, selectedModel]
  );

  // Optimized chat selection handler using useCallback
  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  // Optimized model selection handler using useCallback
  const handleSelectModel = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(event.target.value);
    },
    []
  );

  // Handler for starting a new conversation
  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
    setUserInput('');
  }, []);

  // Example of using useMemo for a potentially expensive computation
  const sortedChats = useMemo(() => {
    return [...allChats].sort((a, b) => b.createdAt - a.createdAt);
  }, [allChats]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen bg-gray-100 overflow-hidden m-0 p-0">
        <ChatSidebar
          chats={sortedChats}
          onSelectChat={handleSelectChat}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
        />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          userInput={userInput}
          setUserInput={setUserInput}
          handleSendMessage={handleSendMessage}
          selectedModel={selectedModel}
          handleSelectModel={handleSelectModel}
          models={MODELS}
        />
      </div>
    </ProtectedRoute>
  );
}
