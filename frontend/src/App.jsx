import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Toaster } from 'react-hot-toast';

import Sidebar from './componenets/Sidebar';
import AiPage from './pages/AiPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useAuthStore } from './store/useAuthStore';
import PageLoader from './componenets/PageLoader';

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);
  if (isCheckingAuth) return <PageLoader />;

  return (
    // <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex">
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex fixed">
      {authUser && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <div
        className={`flex-1 overflow-y-auto flex flex-col ${
          authUser ? '' : 'justify-center items-center'
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              authUser ? (
                <div className="h-full p-4 md:p-6">
                  <AiPage setIsSidebarOpen={setIsSidebarOpen} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;

// import { useEffect, useState } from 'react';
// import { Navigate, Route, Routes } from 'react-router';
// import { Toaster } from 'react-hot-toast';

// import Sidebar from './componenets/Sidebar';
// import AiPage from './pages/AiPage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import { useAuthStore } from './store/useAuthStore';
// import PageLoader from './componenets/PageLoader';

// function App() {
//   const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   // Close sidebar when window is resized to desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Prevent body scroll when sidebar is open on mobile
//   useEffect(() => {
//     if (isSidebarOpen && window.innerWidth < 768) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   if (isCheckingAuth) return <PageLoader />;

//   return (
//     <div className="h-screen-mobile w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex fixed inset-0">
//       {authUser && (
//         <Sidebar
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />
//       )}

//       {/* Main content area */}
//       <div
//         className={`flex-1 flex flex-col ${
//           authUser ? '' : 'justify-center items-center'
//         }`}
//       >
//         <Routes>
//           <Route
//             path="/"
//             element={
//               authUser ? (
//                 <div className="flex-1 flex flex-col h-full">
//                   <AiPage setIsSidebarOpen={setIsSidebarOpen} />
//                 </div>
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route
//             path="/login"
//             element={!authUser ? <LoginPage /> : <Navigate to="/" />}
//           />
//           <Route
//             path="/signup"
//             element={!authUser ? <SignupPage /> : <Navigate to="/" />}
//           />
//         </Routes>
//       </div>

//       <Toaster position="top-center" reverseOrder={false} />
//     </div>
//   );
// }

// export default App;
