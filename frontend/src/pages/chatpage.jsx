import React, { useState, useEffect } from 'react';
import { askBIS } from "../services/api";
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
  const [sources, setSources] = useState([]);
  const [labs, setLabs] = useState([]);
 

  // Clear messages when switching domains so each has its tailored welcome state
 useEffect(() => {
  setMessages([]);
  setInput('');
  setIsLoading(false);
  setSources([]);
  setLabs([]);
}, [activeDomainKey]);

  

  const handleSendMessage = async (textToSend = input) => {
  const trimmed = textToSend.trim();
  if (!trimmed || isLoading) return;

  // 1. Add user message
  const userMsg = {
    id: `user-${Date.now()}`,
    sender: 'user',
    text: trimmed,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput('');
  setIsLoading(true);

  try {
    // 2. Call the real BIS Assist backend
    const result = await askBIS(trimmed);
    
    setSources(result.sources || []);
    setLabs(result.labs || []);

    // 3. Add real backend response
    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: result.response || 'No response received from the backend.',
      data: result,
      sources: result.sources || [],
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, aiMsg]);
  } catch (error) {
    console.error('BIS Assist API error:', error);

    const errorMsg = {
      id: `ai-error-${Date.now()}`,
      sender: 'ai',
      text: 'Sorry, I could not connect to the BIS Assist backend. Please make sure the backend server is running.',
      data: null,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setIsLoading(false);
  }
};

  const handleSelectSuggestion = (suggestion) => {
    handleSendMessage(suggestion.query);
  };

  const handleStopGenerating = () => {
  setIsLoading(false);
};

 const handleNewChat = () => {
  handleStopGenerating();
  setMessages([]);
  setInput('');
  setSources([]);
};

  const handleRegenerate = async (lastAiMessage) => {
  if (isLoading || !lastAiMessage) return;

  setIsLoading(true);

  try {
    const result = await askBIS(lastAiMessage.text);

    const regeneratedMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: result.response || 'No response received from the backend.',
      data: result,
      sources: result.sources || [],
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => {
      const index = prev.findIndex(
        (message) => message.id === lastAiMessage.id
      );

      if (index === -1) {
        return [...prev, regeneratedMessage];
      }

      const updated = [...prev];
      updated[index] = regeneratedMessage;
      return updated;
    });
  } catch (error) {
    console.error('BIS Assist regenerate error:', error);
  } finally {
    setIsLoading(false);
  }
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
  sources={sources}
  labs={labs}
/>
        </div>
      </main>
    </div>
  );
}