import { MOCK_CHAT_LIST, MOCK_CHAT_MESSAGES, ORGANIZATIONS, CURRENT_USER } from '../constants';
import type { ChatConversation, ChatMessage } from '../types';

type MessageListener = (chatId: string, message: ChatMessage) => void;

// Simulate a WebSocket service for real-time chat
class ChatService {
  private listeners: MessageListener[] = [];
  private mockResponses: Record<string, string[]> = {
      'chat1': ["To je skvělé, pojďme si zavolat zítra ve 14:00. Pošlu vám pozvánku."],
      'chat2': ["Pro zpracování plateb používáme Stripe. Hlavním úkolem je vytvořit novou komponentu v Reactu, která bude komunikovat se Stripe API pro checkout a správu předplatného."],
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
      
      const responseText = this.mockResponses[chatId]?.[0] || "Děkujeme za vaši zprávu! Ozveme se vám co nejdříve.";
      
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
