import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getChatList } from '../services/chatService';
import type { ChatConversation } from '../types';

interface ChatListPageProps {
  onChatSelect: (chatId: string) => void;
}

const ChatListItem: React.FC<{ conversation: ChatConversation; onSelect: () => void; }> = ({ conversation, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer mb-4"
        >
            <img src={conversation.organization.logoUrl} alt={conversation.organization.name} className="w-14 h-14 rounded-full mr-4"/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-brand-dark">{conversation.organization.name}</h3>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">{conversation.projectTitle}</p>
                <div className="flex justify-between items-end mt-1">
                    <p className="text-sm text-gray-600 truncate pr-4">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                        <span className="bg-brand-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};


const ChatListPage: React.FC<ChatListPageProps> = ({ onChatSelect }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  useEffect(() => {
    // Fetch conversations from the service
    const chats = getChatList();
    setConversations(chats);
  }, []);

  return (
    <div>
      <Header title="My Messages" />
      
      {conversations.length > 0 ? (
        conversations.map(convo => (
          <ChatListItem 
            key={convo.id} 
            conversation={convo} 
            onSelect={() => onChatSelect(convo.id)} 
          />
        ))
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-brand-dark">No conversations yet.</h3>
            <p className="text-gray-500 mt-2">Start a conversation by applying for a project or asking a question.</p>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;