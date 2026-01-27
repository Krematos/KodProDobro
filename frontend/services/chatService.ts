/**
 * Chat služba pro komunikaci s backend API
 * Upravená verze s real-time functionality pomocí pollingu
 */

import { apiClient } from '../utils/apiClient';
import API_CONFIG from '../config/apiConfig';
import type { ChatConversation, ChatMessage } from '../types';

export interface BackendChat {
  id: number;
  participants: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  createdAt: string;
}

export interface BackendChatMessage {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  chat: {
    id: number;
  };
  createdAt: string;
}

type MessageListener = (chatId: string, message: ChatMessage) => void;

/**
 * Chat Service s podporou real-time pollingu
 */
class ChatService {
  private listeners: MessageListener[] = [];
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  subscribe(listener: MessageListener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: MessageListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notify(chatId: string, message: ChatMessage) {
    this.listeners.forEach(listener => listener(chatId, message));
  }

  /**
   * Odeslání zprávy do chatu
   */
  async sendMessage(chatId: string, text: string): Promise<void> {
    try {
      await apiClient.post(
        API_CONFIG.endpoints.chats.sendMessage(chatId),
        { content: text }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Spustí polling pro nové zprávy (pro simulaci real-time)
   */
  startPolling(chatId: string, interval: number = 5000) {
    if (this.pollingIntervals.has(chatId)) {
      return; // Už běží polling pro tento chat
    }

    const pollInterval = setInterval(async () => {
      // Zde by se načítaly nové zprávy a upozorňovaly listeners
      // Pro jednoduchost můžeme použít getChatMessages
    }, interval);

    this.pollingIntervals.set(chatId, pollInterval);
  }

  /**
   * Zastaví polling pro chat
   */
  stopPolling(chatId: string) {
    const interval = this.pollingIntervals.get(chatId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(chatId);
    }
  }

  /**
   * Zastaví všechny polling intervaly
   */
  stopAllPolling() {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
  }
}

export const chatService = new ChatService();

/**
 * Získá seznam chatů uživatele
 */
/**
 * Získá seznam chatů uživatele a namapuje je na ChatConversation
 */
export const getChatList = async (): Promise<ChatConversation[]> => {
  try {
    const response = await apiClient.get<BackendChat[]>(
      API_CONFIG.endpoints.chats.list
    );
    // Mapujeme každý chat na ChatConversation
    // Note: Pro list view možná nebudeme mít "lastMessage" pokud to backend neposílá rovnou.
    // Pro teď to necháme prázdné nebo upravíme mapper.
    return response.map(chat => mapBackendChatToConversation(chat));
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    throw error;
  }
};

/**
 * Mapování backend chat na frontend ChatConversation
 */
const mapBackendChatToConversation = (
  chat: BackendChat,
  lastMessage?: BackendChatMessage
): ChatConversation => {
  // Pro teď použijeme prvního participanta jako organizaci
  // Toto lze upravit podle struktury vašeho backendu
  const otherParticipant = chat.participants[0];

  return {
    id: chat.id.toString(),
    organization: {
      id: otherParticipant.id.toString(),
      name: otherParticipant.username,
      logoUrl: '', // Backend nevrací logo, můžete přidat výchozí
      description: '',
      website: '',
      isCommunityChampion: false,
      projectsPosted: 0
    },
    projectTitle: '', // Backend nevrací název projektu
    lastMessage: lastMessage?.content || '',
    timestamp: lastMessage?.createdAt || chat.createdAt,
    unreadCount: 0
  };
};

/**
 * Mapování backend zprávy na frontend ChatMessage
 */
const mapBackendMessageToFrontend = (message: BackendChatMessage, currentUserId?: string | number): ChatMessage => {
  const isUser = currentUserId ? message.sender.id.toString() === currentUserId.toString() : false;
  return {
    id: message.id,
    sender: isUser ? 'user' : 'other',
    text: message.content,
    timestamp: new Date(message.createdAt).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    avatar: '' // Backend nevrací avatar
  };
};

/**
 * Získá zprávy z konkrétního chatu
 */
export const getChatMessages = async (chatId: string, currentUserId?: string | number): Promise<ChatMessage[]> => {
  try {
    const backendMessages = await apiClient.get<BackendChatMessage[]>(
      API_CONFIG.endpoints.chats.messages(chatId)
    );
    return backendMessages.map(msg => mapBackendMessageToFrontend(msg, currentUserId));
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    throw error;
  }
};

/**
 * Získá detail konkrétního chatu
 */
export const getChatConversation = async (chatId: string): Promise<ChatConversation> => {
  try {
    // Získáme chat detail
    const chat = await apiClient.get<BackendChat>(
      `${API_CONFIG.endpoints.chats.list}/${chatId}`
    );

    // Získáme zprávy pro tento chat
    const messages = await apiClient.get<BackendChatMessage[]>(
      API_CONFIG.endpoints.chats.messages(chatId)
    );

    // Najdeme poslední zprávu
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

    return mapBackendChatToConversation(chat, lastMessage);
  } catch (error) {
    console.error('Failed to fetch chat conversation:', error);
    throw error;
  }
};

export default chatService;