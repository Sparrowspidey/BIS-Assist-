import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOMAINS } from '../data/domainConfig';
import ChatSidebar from '../components/chatbot/ChatSidebar';
import ChatHeader from '../components/chatbot/ChatHeader';
import ChatArea from '../components/chatbot/ChatArea';
import ContextPanel from '../components/chatbot/ContextPanel';
import '../components/chatbot/chatbot.css';

export default function ChatPage({ defaultDomain = 'standards' }) {
  const { domainId } = useParams();
  const navigate = useNavigate();

  // Validate active domain or fallback
  const activeDomainKey = (domainId && DOMAINS[domainId]) ? domainId : defaultDomain;
  const domainConfig = DOMAINS[activeDomainKey] || DOMAINS.standards;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const timeoutRef = React.useRef(null);

  // Clear messages when switching domains so each has its tailored welcome state
  useEffect(() => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [activeDomainKey]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSendMessage = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // 1. Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 2. Select realistic response from domainConfig
    const domainResponses = domainConfig.defaultResponses || {};
    const matchedResponse = domainResponses[trimmed] || domainResponses.fallback;

    // 3. Realistic typing simulation delay (750ms)
    timeoutRef.current = setTimeout(() => {
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: matchedResponse?.summary || 'Standard analysis complete.',
        data: matchedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 750);
  };

  const handleSelectSuggestion = (suggestion) => {
    handleSendMessage(suggestion.query);
  };

  const handleStopGenerating = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
  };

  const handleNewChat = () => {
    handleStopGenerating();
    setMessages([]);
    setInput('');
  };

  const handleRegenerate = (lastAiMessage) => {
    if (isLoading) return;
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleSelectRecentChat = (chat) => {
    handleNewChat();
    // Simulate query from recent chat
    handleSendMessage(chat.title);
  };

  return (
    <div className="chat-page-root">
      {/* Slim Vertical Sidebar */}
      <ChatSidebar
        currentDomain={activeDomainKey}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectRecentChat}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Layout */}
      <main className="chat-workspace-main">
        {/* Top Header */}
        <ChatHeader
          domainConfig={domainConfig}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          contextOpen={contextOpen}
          onToggleContext={() => setContextOpen(!contextOpen)}
          onNewChat={handleNewChat}
        />

        {/* Workspace Body: Main Chat Area + Context Panel */}
        <div className="workspace-body-container">
          <ChatArea
            domainConfig={domainConfig}
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={() => handleSendMessage()}
            isLoading={isLoading}
            onStop={handleStopGenerating}
            onSelectSuggestion={handleSelectSuggestion}
            onRegenerate={handleRegenerate}
          />

          {/* Right Context Panel */}
          <ContextPanel
            domainConfig={domainConfig}
            isOpen={contextOpen}
            onClose={() => setContextOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}