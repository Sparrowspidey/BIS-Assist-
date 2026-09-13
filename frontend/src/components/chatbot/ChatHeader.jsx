import React from 'react';
import { Menu, PanelRightClose, PanelRightOpen, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ChatHeader({
  domainConfig,
  onOpenMobileSidebar,
  contextOpen,
  onToggleContext,
  onNewChat
}) {
  return (
    <header className="chat-header">
      <div className="header-left">
        {/* Mobile menu trigger */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={20} />
        </button>

        <div className="header-titles">
          <div className="header-badge-row">
            <span className="header-label">{domainConfig.label}</span>
            <span className="header-tag">{domainConfig.badge}</span>
          </div>
          <h1 className="header-main-title">{domainConfig.title}</h1>
        </div>
      </div>

      <div className="header-right">
        {/* Verification Pill */}
        <div className="header-trust-pill" title="Verified against official BIS gazette and standard records">
          <ShieldCheck size={14} className="trust-icon" />
          <span>Source-Backed</span>
        </div>

        {/* Live Status Indicator */}
        <div className="header-status-indicator" title="BIS SmartStandards AI engine is operational">
          <span className="status-dot pulse" />
          <span className="status-label">Online</span>
        </div>

        {/* Reset / New Chat Action */}
        <button
          type="button"
          className="header-icon-action"
          onClick={onNewChat}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw size={16} />
        </button>

        {/* Context panel toggle */}
        <button
          type="button"
          className={`header-icon-action ${contextOpen ? 'active' : ''}`}
          onClick={onToggleContext}
          title={contextOpen ? 'Hide workspace context panel' : 'Show workspace context panel'}
          aria-label="Toggle workspace context panel"
        >
          {contextOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>
    </header>
  );
}
