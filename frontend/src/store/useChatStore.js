import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChat: null,
  chatMessages: {},
  isLoading: false,

  // 🔹 Fetch all user chats
  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.get('/chats/my');
      set({ chats: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ chats: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔹 Fetch messages for a specific chat
  fetchMessages: async (chatId) => {
    try {
      const { data } = await axiosInstance.get(`/messages/${chatId}`);
      set((state) => ({
        chatMessages: { ...state.chatMessages, [chatId]: data },
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  // 🔹 Create new chat
  createChat: async () => {
    try {
      const { data } = await axiosInstance.post('/chats');
      set((state) => ({
        chats: [data, ...state.chats],
        activeChat: data,
      }));
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  },

  // 🔹 Rename a chat
  renameChat: async (chatId, newName) => {
    try {
      const { data } = await axiosInstance.put(`/chats/${chatId}`, {
        name: newName,
      });
      set((state) => ({
        chats: state.chats.map((chat) => (chat._id === chatId ? data : chat)),
        activeChat: state.activeChat?._id === chatId ? data : state.activeChat,
      }));
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  },

  // 🔹 Add message locally
  addMessage: (chatId, message) => {
    set((state) => {
      const updatedMessages = [...(state.chatMessages[chatId] || []), message];
      return {
        chatMessages: { ...state.chatMessages, [chatId]: updatedMessages },
        chats: state.chats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessageText: message.text,
                updatedAt: new Date().toISOString(),
              }
            : chat,
        ),
      };
    });
  },

  // 🔹 Send message to backend
  sendMessage: async (chatId, text, sender = 'User') => {
    try {
      const { data } = await axiosInstance.post('/messages', {
        chatId,
        text,
        sender,
      });

      // Add message to chat
      get().addMessage(chatId, data);

      // Only rename chat if it's the first USER message
      const messages = get().chatMessages[chatId] || [];
      const userMessages = messages.filter((msg) => msg.sender === 'User');

      if (userMessages.length === 1 && sender === 'User') {
        get().renameChat(chatId, text.slice(0, 30));
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  // 🔹 Delete a chat
  deleteChat: async (chatId) => {
    try {
      await axiosInstance.delete(`/chats/${chatId}`);
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
        activeChat: state.activeChat?._id === chatId ? null : state.activeChat,
        chatMessages: { ...state.chatMessages, [chatId]: undefined },
      }));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  // 🔹 Archive a chat
  archiveChat: async (chatId) => {
    try {
      await axiosInstance.put(`/chats/${chatId}/archive`);
      set((state) => ({
        chats: state.chats.filter((chat) => chat._id !== chatId),
        activeChat: state.activeChat?._id === chatId ? null : state.activeChat,
      }));
    } catch (error) {
      console.error('Error archiving chat:', error);
    }
  },

  // 🔹 Delete a specific message
  deleteMessage: async (chatId, messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        chatMessages: {
          ...state.chatMessages,
          [chatId]: state.chatMessages[chatId].filter(
            (msg) => msg._id !== messageId,
          ),
        },
      }));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  },

  setActiveChat: (chat) => set({ activeChat: chat }),
}));
