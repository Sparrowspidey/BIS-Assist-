import  { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import './App.css';

// Component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Dedicated Domain Chatbot Routes */}
        <Route path="/chat" element={<Navigate to="/chat/standards" replace />} />
        <Route path="/chat/standards" element={<ChatPage defaultDomain="standards" />} />
        <Route path="/chat/certification" element={<ChatPage defaultDomain="certification" />} />
        <Route path="/chat/laboratory" element={<ChatPage defaultDomain="laboratory" />} />
        <Route path="/chat/hallmarking" element={<ChatPage defaultDomain="hallmarking" />} />
        <Route path="/chat/consumer" element={<ChatPage defaultDomain="consumer" />} />
        <Route path="/chat/multilingual" element={<ChatPage defaultDomain="multilingual" />} />

        {/* Dynamic Route Handler */}
        <Route path="/chat/:domainId" element={<ChatPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}