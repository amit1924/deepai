// import React, { useEffect, useState } from 'react';
// import { useChatStore } from '../store/useChatStore';
// import { useAuthStore } from '../store/useAuthStore';

// const Sidebar = () => {
//   const {
//     chats,
//     activeChat,
//     fetchChats,
//     createChat,
//     setActiveChat,
//     deleteChat,
//     archiveChat,
//     isLoading,
//   } = useChatStore();
//   const { authUser, logout } = useAuthStore();
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   useEffect(() => {
//     fetchChats();
//   }, [fetchChats]);

//   const handleChatSelect = (chat) => setActiveChat(chat);
//   const handleLogout = async () => {
//     await logout();
//     setShowUserMenu(false);
//   };

//   return (
//     <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700 h-screen relative">
//       {/* Header / User Info */}
//       <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//         <div
//           onClick={() => setShowUserMenu(!showUserMenu)}
//           className="cursor-pointer flex items-center space-x-3"
//         >
//           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
//             {authUser?.name?.charAt(0).toUpperCase() || 'U'}
//           </div>
//           <div className="flex flex-col">
//             <span className="font-medium truncate">
//               {authUser?.name || 'User'}
//             </span>
//             <span className="text-xs text-gray-400 truncate">
//               {authUser?.email}
//             </span>
//           </div>
//         </div>
//         <button
//           onClick={createChat}
//           className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
//         >
//           ➕
//         </button>
//       </div>

//       {/* User Menu */}
//       {showUserMenu && (
//         <div className="absolute top-16 left-4 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-2">
//           <button
//             onClick={handleLogout}
//             className="w-full text-left p-2 hover:bg-red-600 rounded flex items-center"
//           >
//             🚪 Logout
//           </button>
//         </div>
//       )}

//       {/* Chat List */}
//       <div className="flex-1 overflow-y-auto mt-2">
//         {isLoading ? (
//           <div className="flex justify-center items-center p-4 animate-pulse">
//             Loading...
//           </div>
//         ) : chats.length > 0 ? (
//           chats.map((chat) => (
//             <div
//               key={chat._id}
//               onClick={() => handleChatSelect(chat)}
//               className={`p-3 cursor-pointer mb-1 mx-2 rounded-lg flex justify-between items-center ${
//                 activeChat?._id === chat._id
//                   ? 'bg-gray-700 border-l-4 border-blue-500'
//                   : 'hover:bg-gray-800'
//               }`}
//             >
//               <div>
//                 <div className="font-medium truncate">
//                   {chat.name || 'New Chat'}
//                 </div>
//                 {/* // To this (more accurate): */}
//                 <div className="text-xs text-gray-400">
//                   {chat.lastMessageText
//                     ? chat.lastMessageText.length > 30
//                       ? chat.lastMessageText.substring(0, 30) + '...'
//                       : chat.lastMessageText
//                     : 'No messages yet'}
//                 </div>
//               </div>
//               <div className="flex flex-col gap-1 ml-2">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     archiveChat(chat._id);
//                   }}
//                   className="text-xs text-gray-300 hover:text-blue-400"
//                 >
//                   📁
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteChat(chat._id);
//                   }}
//                   className="text-xs text-gray-300 hover:text-red-500"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center p-6 text-gray-400 italic">
//             No chats available
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

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
    // Close sidebar on mobile after selecting a chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateChat = () => {
    createChat();
    // Close sidebar on mobile after creating a chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
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

      {/* Sidebar */}
      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700 h-screen
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
              <span className="font-medium truncate">
                {authUser?.fullName || 'User'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCreateChat}
              className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
              title="New Chat"
            >
              ➕
            </button>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Menu */}
        {showUserMenu && (
          <div className="absolute top-16 left-4 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 hover:bg-red-600 rounded flex items-center"
            >
              🚪 Logout
            </button>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto mt-2">
          {isLoading ? (
            <div className="flex justify-center items-center p-4 animate-pulse">
              Loading...
            </div>
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`p-3 cursor-pointer mb-1 mx-2 rounded-lg flex justify-between items-center ${
                  activeChat?._id === chat._id
                    ? 'bg-gray-700 border-l-4 border-blue-500'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {chat.name || 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {chat.lastMessageText
                      ? chat.lastMessageText.length > 30
                        ? chat.lastMessageText.substring(0, 30) + '...'
                        : chat.lastMessageText
                      : 'No messages yet'}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveChat(chat._id);
                    }}
                    className="text-xs text-gray-300 hover:text-blue-400"
                    title="Archive"
                  >
                    📁
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat._id);
                    }}
                    className="text-xs text-gray-300 hover:text-red-500"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-400 italic">
              No chats available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
