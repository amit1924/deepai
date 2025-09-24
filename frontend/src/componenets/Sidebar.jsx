import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    chats,
    activeChat,
    fetchChats,
    createChat,
    setActiveChat,
    deleteChat,
    archiveChat,
    isLoading,
  } = useChatStore();
  const { authUser, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateChat = () => {
    createChat();
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // Function to truncate text properly
  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'No messages yet';

    let cleanText = text.trim();
    if (cleanText.length > 100) {
      cleanText = cleanText.substring(0, 100) + '...';
    }

    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + '...'
      : cleanText;
  };

  // Function to generate proper chat name
  const getChatName = (chat) => {
    if (chat.name && chat.name.trim()) {
      return truncateText(chat.name, 25);
    }

    if (chat.lastMessageText) {
      const cleanName = truncateText(chat.lastMessageText, 25);
      return cleanName === 'No messages yet' ? 'New Chat' : cleanName;
    }

    return 'New Chat';
  };

  // Function to get preview text
  const getPreviewText = (chat) => {
    if (!chat.lastMessageText) return 'No messages yet';
    return truncateText(chat.lastMessageText, 35);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - FIXED POSITIONING */}
      <div
        className={`
        fixed md:fixed inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700 h-full
        transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }
      `}
      >
        {/* Header / User Info */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer flex items-center space-x-3 flex-1 min-w-0"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              {authUser?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium truncate text-sm">
                {authUser?.fullName || 'User'}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {authUser?.email || ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCreateChat}
              className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
              title="New Chat"
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
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User Menu */}
        {showUserMenu && (
          <div className="absolute top-16 left-4 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-gray-700 rounded-lg flex items-center gap-2 text-sm transition-colors duration-200"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-3 cursor-pointer mx-2 rounded-lg flex justify-between items-center group transition-colors duration-200 ${
                  activeChat?._id === chat._id
                    ? 'bg-gray-700 border-l-4 border-blue-500'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate text-sm mb-1">
                    {getChatName(chat)}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {getPreviewText(chat)}
                  </div>
                </div>
                <div className="flex gap-1 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveChat(chat._id);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    title="Archive"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat._id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Delete"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-400">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm">No chats yet</p>
              <p className="text-xs mt-1">
                Create your first chat to get started!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            DeepAI App v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
