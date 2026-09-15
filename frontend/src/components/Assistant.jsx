import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import AIOrb from './chatbot/AIOrb';
import './Assistant.css';

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState(false);
  const navigate = useNavigate();

  const handleAsk = () => {
    if (!question.trim()) return;
    setAsked(true);
  };

  const handleSuggestionClick = (q) => {
    setQuestion(q);
    setAsked(true);
  };

  return (
    <section className="assistant-section" id="assistant">
      <div className="assistant-heading">
        <span className="section-label">
          AI WORKSPACE PREVIEW
        </span>

        <h2>
          Ask anything about
          <span> Indian Standards</span>
        </h2>

        <p>
          Experience real-time, clause-level intelligence backed by official BIS standards,
          certification criteria, and gazette notifications.
        </p>
      </div>

      <div className="assistant-container">
        <div className="assistant-box">
          {/* Top Bar */}
          <div className="assistant-top">
            <div className="assistant-avatar-group">
              <AIOrb size="xs" animated={true} />
              <div>
                <strong>BIS Intelligence Workspace</strong>
                <span>Interactive AI Standards Engine</span>
              </div>
            </div>

            <div className="assistant-status">
              <span className="status-indicator-dot" />
              <span>Online</span>
            </div>
          </div>

          {/* Body */}
          <div className="assistant-body">
            {!asked ? (
              <div className="assistant-empty">
                <div className="big-ai-orb-preview">
                  <AIOrb size="md" theme="standards" animated={true} />
                </div>

                <h3>How can BIS Assist help you today?</h3>

                <p>
                  Ask about product specifications, certification schemes, testing laboratories,
                  hallmarking guidelines, or consumer protections.
                </p>
              </div>
            ) : (
              <div className="conversation">
                <div className="user-message">
                  {question}
                </div>

                <div className="ai-message">
                  <div className="ai-message-header">
                    <Sparkles size={14} className="ai-sparkle-icon" />
                    <span>BIS SmartStandards AI</span>
                  </div>

                  <h3>Relevant Standard Identified</h3>

                  <p>
                    Based on semantic matching with the official Bureau of Indian Standards catalogue,
                    this standard applies to your specified product category.
                  </p>

                  <div className="standard-card">
                    <div>
                      <span className="result-label">
                        INDIAN STANDARD
                      </span>
                      <strong>
                        IS 17803 : 2022
                      </strong>
                      <p>
                        Stainless Steel Water Bottles & Vacuum Flasks
                      </p>
                    </div>

                    <div className="match-score">
                      <strong>96%</strong>
                      <span>Match</span>
                    </div>
                  </div>

                  <div className="source-card">
                    <FileText size={18} className="source-doc-icon" />
                    <div>
                      <strong>Official Gazette Reference</strong>
                      <p>Clause 4.2 · Page 18 · QCO Order</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion Pills */}
          <div className="suggestions">
            <span className="try-label">Try asking:</span>

            <button
              type="button"
              onClick={() => handleSuggestionClick('Which BIS standard applies to steel water bottles?')}
            >
              Steel water bottles standard
            </button>

            <button
              type="button"
              onClick={() => handleSuggestionClick('What are the BIS certification requirements for manufacturers?')}
            >
              Certification requirements
            </button>

            <button
              type="button"
              onClick={() => handleSuggestionClick('How can I verify a gold hallmark HUID code?')}
            >
              Hallmark HUID verification
            </button>
          </div>

          {/* Input Box */}
          <div className="assistant-input">
            <input
              type="text"
              placeholder="Ask anything about Indian Standards..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAsk();
                }
              }}
            />

            <button
              type="button"
              onClick={handleAsk}
              className="assistant-send-btn"
              title="Submit query"
            >
              ↑
            </button>
          </div>

          {/* Launch Full Workspace Banner */}
          <div className="assistant-launch-banner">
            <div>
              <strong>Ready for dedicated domain workflows?</strong>
              <p>Explore specialized assistants for Standards, Certification, Labs, Hallmarking & Consumer Rights.</p>
            </div>
            <button
              type="button"
              className="launch-workspace-cta"
              onClick={() => navigate('/chat/standards')}
            >
              <span>Launch Full Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}