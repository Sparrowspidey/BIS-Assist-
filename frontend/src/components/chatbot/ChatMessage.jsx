import React from 'react';
import { Sparkles, User, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Sources from './Sources';
import ChatActions from './ChatActions';
import AIOrb from './AIOrb';

export default function ChatMessage({ message, onRegenerate }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="message-row user-row">
        <div className="user-message-container">
          <div className="user-bubble">
            <p className="user-text">{message.text}</p>
          </div>
          <div className="user-avatar-badge">
            <User size={13} />
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  const data = message.data || {};
  const fullCopyText = [
    data.title || '',
    data.summary || message.text || '',
    ...(data.bulletPoints || []),
    ...(data.sources ? data.sources.map(s => `${s.code} - ${s.clause}`) : [])
  ].filter(Boolean).join('\n\n');

  return (
    <div className="message-row ai-row">
      <div className="ai-message-wrapper">
        {/* Left Mini AI Orb Avatar */}
        <div className="ai-avatar-column">
          <AIOrb size="xs" animated={false} />
        </div>

        {/* AI Content Area */}
        <div className="ai-content-body">
          {/* Header row */}
          <div className="ai-meta-header">
            <span className="ai-name">BIS SmartStandards AI</span>
            <span className="ai-role-tag">Verified Gazette Analysis</span>
          </div>

          {/* Heading */}
          {data.title && <h3 className="ai-heading">{data.title}</h3>}

          {/* Summary / Lead Paragraph */}
          {data.summary ? (
            <p className="ai-paragraph">{data.summary}</p>
          ) : (
            <p className="ai-paragraph">{message.text}</p>
          )}

          {/* Highlighted Standard Card / Badge */}
          {data.highlight && (
            <div className="ai-highlight-card">
              <div className="highlight-left">
                <span className="highlight-badge-label">OFFICIAL STANDARD</span>
                <strong className="highlight-code">{data.highlight.code}</strong>
                <span className="highlight-name">{data.highlight.name}</span>
              </div>
              {data.highlight.matchScore && (
                <div className="highlight-score">
                  <CheckCircle2 size={14} className="score-icon" />
                  <span>{data.highlight.matchScore}</span>
                </div>
              )}
            </div>
          )}

          {/* Bullet Points */}
          {data.bulletPoints && data.bulletPoints.length > 0 && (
            <ul className="ai-bullet-list">
              {data.bulletPoints.map((item, idx) => {
                // Parse simple markdown bold syntax **bold**
                const parts = item.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={idx} className="ai-bullet-item">
                    <span className="bullet-indicator">●</span>
                    <span className="bullet-content">
                      {parts.map((part, pIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Sources Section */}
          {data.sources && data.sources.length > 0 && (
            <Sources sources={data.sources} />
          )}

          {/* Response Actions */}
          <ChatActions
            textToCopy={fullCopyText}
            onRegenerate={onRegenerate ? () => onRegenerate(message) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
