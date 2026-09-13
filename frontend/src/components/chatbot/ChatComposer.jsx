import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ArrowUp, Square, Paperclip, Sparkles } from 'lucide-react';

export default function ChatComposer({
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  placeholder = 'Ask anything about BIS Standards, schemes, or compliance...'
}) {
  const [isListening, setIsListening] = useState(false);
  const [showAttachTooltip, setShowAttachTooltip] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  const toggleVoice = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      // Simulate demo voice transcription after brief delay
      setTimeout(() => {
        setInput((prev) =>
          prev
            ? prev + ' How to verify hallmark HUID?'
            : 'How to verify hallmark HUID?'
        );
        setIsListening(false);
      }, 2500);
    }
  };

  const handleAttachClick = () => {
    setShowAttachTooltip(true);
    setTimeout(() => setShowAttachTooltip(false), 2400);
  };

  const hasContent = input && input.trim().length > 0;

  return (
    <div className="chat-composer-outer-wrapper">
      <div className={`chat-composer-pill ${hasContent ? 'composer-active' : ''} ${isListening ? 'composer-listening' : ''}`}>
        {/* Attach File Button */}
        <div className="composer-action-btn-wrapper">
          <button
            type="button"
            className="composer-btn composer-attach-btn"
            onClick={handleAttachClick}
            title="Attach specification, image, or test document (Future Integration)"
            aria-label="Attach file"
          >
            <Plus size={19} />
          </button>
          {showAttachTooltip && (
            <div className="attach-tooltip-bubble">
              <Paperclip size={12} />
              <span>Document upload ready for backend integration</span>
            </div>
          )}
        </div>

        {/* Textarea Input */}
        <div className="composer-input-container">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening to speech in your language...' : placeholder}
            className="composer-textarea"
            aria-label="Chat input message"
          />
        </div>

        {/* Right Action Icons: Voice & Send */}
        <div className="composer-right-actions">
          {/* Voice Input Button */}
          <button
            type="button"
            className={`composer-btn composer-voice-btn ${isListening ? 'listening-active' : ''}`}
            onClick={toggleVoice}
            title={isListening ? 'Stop listening' : 'Voice Input (Bhashini AI Speech Mode)'}
            aria-label="Voice input"
          >
            <Mic size={18} />
            {isListening && <span className="voice-wave-pulse" />}
          </button>

          {/* Send or Stop Generating Button */}
          {isLoading ? (
            <button
              type="button"
              className="composer-send-btn stop-active"
              onClick={onStop}
              title="Stop generating response"
              aria-label="Stop generating response"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              type="button"
              className={`composer-send-btn ${hasContent ? 'active' : 'disabled'}`}
              onClick={onSend}
              disabled={!hasContent}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <ArrowUp size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Trust & Verification Footnote */}
      <div className="composer-disclaimer-row">
        <p className="composer-disclaimer-text">
          BIS AI may make mistakes. Verify critical standards and clauses against official BIS gazette publications.
        </p>
      </div>
    </div>
  );
}
