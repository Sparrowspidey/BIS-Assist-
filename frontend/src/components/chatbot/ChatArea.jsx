import React, { useRef, useEffect } from 'react';
import AIOrb from './AIOrb';
import SuggestionCards from './SuggestionCards';
import ChatMessage from './ChatMessage';
import ChatComposer from './ChatComposer';
import { Sparkles } from 'lucide-react';

export default function ChatArea({
  domainConfig,
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  onSelectSuggestion,
  onRegenerate
}) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages or loading state
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="chat-main-area-container">
      {/* Scrollable Conversation / Welcome View */}
      <div className="chat-scroll-area" ref={scrollRef}>
        {!hasMessages ? (
          /* Welcome View */
          <div className="chat-welcome-view">
            <div className="welcome-orb-wrapper">
              <AIOrb size="lg" theme={domainConfig.id} animated={true} />
            </div>

            <div className="welcome-tag-badge">
              <Sparkles size={12} />
              <span>{domainConfig.welcome.label}</span>
            </div>

            <h2 className="welcome-hero-heading">
              {domainConfig.welcome.heading}
            </h2>

            <p className="welcome-hero-desc">
              {domainConfig.welcome.description}
            </p>

            <div className="welcome-suggestions-container">
              <SuggestionCards
                suggestions={domainConfig.suggestions}
                onSelectSuggestion={onSelectSuggestion}
              />
            </div>
          </div>
        ) : (
          /* Active Messages View */
          <div className="chat-messages-stream">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                onRegenerate={onRegenerate}
              />
            ))}

            {/* AI Typing / Analyzing Indicator */}
            {isLoading && (
              <div className="message-row ai-row ai-typing-row">
                <div className="ai-message-wrapper">
                  <div className="ai-avatar-column">
                    <AIOrb size="xs" animated={true} />
                  </div>
                  <div className="ai-content-body">
                    <div className="ai-meta-header">
                      <span className="ai-name">BIS SmartStandards AI</span>
                      <span className="ai-role-tag">Processing Inquiry</span>
                    </div>
                    <div className="typing-indicator-box">
                      <span className="typing-dot dot-1" />
                      <span className="typing-dot dot-2" />
                      <span className="typing-dot dot-3" />
                      <span className="typing-label">Analyzing Indian Standards & Gazette Records...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Composer */}
      <ChatComposer
        input={input}
        setInput={setInput}
        onSend={onSend}
        isLoading={isLoading}
        onStop={onStop}
        placeholder={`Ask anything about ${domainConfig.title}...`}
      />
    </div>
  );
}
