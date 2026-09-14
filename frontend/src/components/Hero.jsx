import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import AIOrb from './chatbot/AIOrb';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow-left" />
      <div className="hero-ambient-glow-right" />

      {/* Left side: Editorial Hero Copy */}
      <div className="hero-content">
        <div className="eyebrow">
          <span>🇮🇳 BUREAU OF INDIAN STANDARDS</span>
        </div>

        <h1>
          Intelligence for India's
          <span> Standards Ecosystem</span>
        </h1>

        <p>
          Discover Indian Standards, understand BIS certification, verify hallmarking,
          and receive accurate clause-level guidance backed by official gazette records.
        </p>

        <div className="hero-buttons">
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/chat/standards')}
          >
            <Sparkles size={16} />
            <span>Ask BIS AI</span>
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/chat/standards')}
          >
            <span>Explore Standards</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="trust-row">
          <div className="trust-item">
            <strong>10K+</strong>
            <span>Standards</span>
          </div>

          <div className="trust-divider" />

          <div className="trust-item">
            <strong>AI</strong>
            <span>Powered</span>
          </div>

          <div className="trust-divider" />

          <div className="trust-item">
            <strong className="trust-check">✓</strong>
            <span>Source-backed</span>
          </div>
        </div>
      </div>

      {/* Right side: 3D Glossy AI Orb + Intelligent Preview Card */}
      <div className="hero-visual">
        {/* Floating AI Orb Centerpiece */}
        <div className="hero-orb-floating-anchor">
          <AIOrb size="lg" theme="standards" animated={true} />
        </div>

        {/* Glassmorphic AI Interactive Preview Card */}
        <div className="ai-card" onClick={() => navigate('/chat/standards')} title="Click to open interactive AI Workspace">
          <div className="ai-card-header">
            <div className="ai-icon">
              <Sparkles size={18} />
            </div>

            <div className="ai-card-titles">
              <strong>BIS AI Assistant</strong>
              <span>Intelligent Standards Guide</span>
            </div>

            <div className="online-dot">
              <span className="dot-pulse" />
              <span>Online</span>
            </div>
          </div>

          <div className="question-bubble">
            Which BIS standard applies to stainless steel water bottles?
          </div>

          <div className="ai-answer">
            <div className="answer-label">
              AI ANALYSIS
            </div>

            <h3>Relevant Standard Identified</h3>

            <div className="standard-result">
              <div className="standard-info">
                <strong>IS 17803 : 2022</strong>
                <span>Stainless Steel Water Bottles & Flasks</span>
              </div>

              <div className="match">
                <CheckCircle2 size={13} />
                <span>96%</span>
              </div>
            </div>

            <div className="source-row">
              <div className="source-tag">
                <FileText size={12} />
                <span>Source</span>
              </div>
              <span className="source-clause">
                Clause 4.2 · Page 18
              </span>
            </div>
          </div>

          <div className="ai-input">
            <span>Ask anything about BIS...</span>
            <button
              type="button"
              className="ai-input-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/chat/standards');
              }}
              aria-label="Ask in AI Workspace"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}