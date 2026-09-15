<<<<<<< HEAD
import './App.css'

import Home from './pages/Home'
import Standards from './pages/Standards'
import StandardDetails from './pages/StandardDetails'
import AssistantPage from './pages/AssistantPage'
import Certification from './pages/Certification'
import Laboratories from './pages/Laboratories'
import Multilingual from './pages/Multilingual'

function App() {
  const path = window.location.pathname

  if (path === '/standards') {
    return <Standards />
  }

  if (path.startsWith('/standards/')) {
    return <StandardDetails />
  }

  if (path === '/assistant') {
    return <AssistantPage />
  }

  if (path === '/certification') {
    return <Certification />
  }

  if (path === '/laboratories') {
    return <Laboratories />
  }

  if (path === '/multilingual') {
    return <Multilingual />
  }

  return <Home />
=======
import React, { useEffect } from 'react';
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
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
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