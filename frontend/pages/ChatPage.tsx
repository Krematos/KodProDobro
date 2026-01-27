import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { getChatConversation, getChatMessages, chatService } from '../services/chatService';
import { getCurrentUser } from '../services/userService';
import type { ChatMessage, ChatConversation, User } from '../types';

interface ChatPageProps {
  chatId: string;
  onBack: () => void;
}

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-2 my-2 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <img src={message.avatar} alt="Sender" className="w-8 h-8 rounded-full" />}
      <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${isUser ? 'bg-brand-blue text-white rounded-br-none' : 'bg-gray-200 text-brand-dark rounded-bl-none'}`}>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

const ChatPage: React.FC<ChatPageProps> = ({ chatId, onBack }) => {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const chat = await getChatConversation(chatId);
        setConversation(chat);

        // Pass user ID to correctly identify sender
        const initialMessages = await getChatMessages(chatId, user.id);
        setMessages(initialMessages);
      } catch (error) {
        console.error('Failed to load chat data:', error);
      }
    };

    loadChatData();

    // Subscribe to new messages from the service
    const handleNewMessage = (receivedChatId: string, message: ChatMessage) => {
      if (receivedChatId === chatId) {
        setMessages(prev => [...prev, message]);
      }
    };

    chatService.subscribe(handleNewMessage);

    // Cleanup on unmount
    return () => {
      chatService.unsubscribe(handleNewMessage);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !currentUser) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: currentUser.avatarUrl || '' // Use real user avatar if available
    };

    setMessages(prev => [...prev, userMessage]);
    chatService.sendMessage(conversation.id, newMessage);
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div>
        <Header title="Načítání chatu..." onBack={onBack} />
        <div className="text-center p-8">Načítání detailů konverzace...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 150px)' }}>
      <Header title={`Chat s ${conversation.organization.name}`} onBack={onBack} />

      <div className="flex-grow overflow-y-auto bg-white rounded-lg p-4 shadow-inner mb-4">
        {messages.map(msg => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-auto bg-white p-2 rounded-lg shadow-md">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Napište svou zprávu..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-3 border-none focus:ring-0 rounded-lg bg-gray-100"
          />
          <button type="submit" className="ml-2 bg-brand-blue text-white p-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400" disabled={!newMessage.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;