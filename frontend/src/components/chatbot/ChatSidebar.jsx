import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Compass,
  FileCheck,
  FlaskConical,
  Award,
  ShieldCheck,
  Languages,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { DOMAINS, RECENT_CHATS } from '../../data/domainConfig';
import AIOrb from './AIOrb';

const domainIcons = {
  standards: Compass,
  certification: FileCheck,
  laboratory: FlaskConical,
  hallmarking: Award,
  consumer: ShieldCheck,
  multilingual: Languages
};

export default function ChatSidebar({
  currentDomain,
  onNewChat,
  onSelectChat,
  mobileOpen,
  onCloseMobile
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const navigate = useNavigate();

  const handleDomainSelect = (domainId) => {
    navigate(`/chat/${domainId}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />
      )}

      <aside
        className={`chat-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="sidebar-brand-wrapper">
          <Link to="/" className="sidebar-brand" title="BIS SmartStandards Home">
            <div className="brand-logo-badge">
              <span>BIS</span>
            </div>
            {!collapsed && (
              <div className="brand-info">
                <span className="brand-name">BIS</span>
                <span className="brand-sub">SmartStandards</span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            className="mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Action: New Chat */}
        <div className="sidebar-action-container">
          <button
            type="button"
            className="new-chat-btn"
            onClick={handleNewChat}
            title="Start a new chat session"
          >
            <Plus size={18} className="new-chat-icon" />
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="sidebar-scrollable-content">
          {/* Domains Section */}
          <div className="sidebar-section">
            {!collapsed && (
              <div className="sidebar-section-header">
                <span className="sidebar-section-title">ASSISTANT DOMAINS</span>
              </div>
            )}
            <nav className="domain-nav-list">
              {Object.values(DOMAINS).map((domain) => {
                const IconComponent = domainIcons[domain.id] || Compass;
                const isActive = currentDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => handleDomainSelect(domain.id)}
                    className={`domain-nav-item ${isActive ? 'active' : ''}`}
                    title={domain.title}
                  >
                    <span className="domain-nav-icon-wrapper">
                      <IconComponent size={17} />
                    </span>
                    {!collapsed && (
                      <div className="domain-nav-details">
                        <span className="domain-nav-title">{domain.title}</span>
                        <span className="domain-nav-badge">{domain.badge}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Recent History Section */}
          <div className="sidebar-section">
            {!collapsed && (
              <div className="sidebar-section-header">
                <span className="sidebar-section-title">RECENT CONVERSATIONS</span>
              </div>
            )}
            <div className="history-list">
              {RECENT_CHATS.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  className="history-item-btn"
                  onClick={() => {
                    handleDomainSelect(chat.domain);
                    if (onSelectChat) onSelectChat(chat);
                  }}
                  title={chat.title}
                >
                  <Clock size={14} className="history-item-icon" />
                  {!collapsed && (
                    <div className="history-item-text">
                      <span className="history-title-text">{chat.title}</span>
                      <span className="history-meta">{chat.time}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-footer-link" title="Return to Landing Page">
            <Home size={17} />
            {!collapsed && <span>Landing Page</span>}
          </Link>
          <button
            type="button"
            className="sidebar-footer-link"
            onClick={() => setShowSettingsModal(true)}
            title="Workspace Preferences"
          >
            <Settings size={17} />
            {!collapsed && <span>Settings</span>}
          </button>
          <a
            href="https://www.bis.gov.in"
            target="_blank"
            rel="noreferrer"
            className="sidebar-footer-link"
            title="Official BIS Portal"
          >
            <HelpCircle size={17} />
            {!collapsed && <span>BIS Help</span>}
          </a>

          {!collapsed && (
            <div className="sidebar-user-badge">
              <div className="user-avatar-circle">
                <Sparkles size={14} />
              </div>
              <div className="user-info">
                <span className="user-name">SmartStandards Officer</span>
                <span className="user-role">Public Session</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Settings Modal (Demo ready) */}
      {showSettingsModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>BIS SmartStandards Preferences</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="setting-row">
                <div>
                  <strong>AI Response Detail</strong>
                  <p>Display comprehensive clauses and statutory references</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-row">
                <div>
                  <strong>Bilingual Assistance</strong>
                  <p>Provide Hindi and regional glossaries alongside English</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-row">
                <div>
                  <strong>Citation Highlighting</strong>
                  <p>Emphasize standard numbers and clauses in source cards</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-primary"
                onClick={() => setShowSettingsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
