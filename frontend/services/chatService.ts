import { MOCK_CHAT_LIST, MOCK_CHAT_MESSAGES, ORGANIZATIONS, CURRENT_USER } from '../constants';
import type { ChatConversation, ChatMessage } from '../types';

type MessageListener = (chatId: string, message: ChatMessage) => void;

// Simulate a WebSocket service for real-time chat
class ChatService {
  private listeners: MessageListener[] = [];
  private mockResponses: Record<string, string[]> = {
      'chat1': ["That's great, let's set up a call for tomorrow at 2 PM. I'll send an invite."],
      'chat2': ["We use Stripe for payment processing. The main task is to build a new React component that interacts with the Stripe API for checkout and subscription management."],
  };

  subscribe(listener: MessageListener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: MessageListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notify(chatId: string, message: ChatMessage) {
    this.listeners.forEach(listener => listener(chatId, message));
  }
  
  sendMessage(chatId: string, text: string) {
    console.log(`Message sent to ${chatId}: ${text}`);
    // Simulate a response from the organization after a short delay
    setTimeout(() => {
      const conversation = getChatConversation(chatId);
      if (!conversation) return;
      
      const responseText = this.mockResponses[chatId]?.[0] || "Thanks for your message! We'll get back to you shortly.";
      
      const responseMessage: ChatMessage = {
          id: Date.now(),
          sender: 'other',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: conversation.organization.logoUrl,
      };
      
      this.notify(chatId, responseMessage);
    }, 1500 + Math.random() * 500);
  }
}

export const chatService = new ChatService();

export const getChatList = (): ChatConversation[] => {
  // In a real app, this would fetch from an API
  return MOCK_CHAT_LIST;
};

export const getChatConversation = (chatId: string): ChatConversation | undefined => {
    return MOCK_CHAT_LIST.find(c => c.id === chatId);
}

export const getChatMessages = (chatId: string): ChatMessage[] => {
  // In a real app, this would fetch from an API
  return MOCK_CHAT_MESSAGES[chatId] || [];
};