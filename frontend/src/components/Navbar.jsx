import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Globe, Shield, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [langMenu, setLangMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" title="BIS SmartStandards Home">
          <div className="logo-mark">
            BIS
          </div>
          <div className="logo-text">
            <span>BIS</span>
            <small>SmartStandards</small>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="nav-links">
          <Link to="/chat/standards" className="nav-link-item">
            <Sparkles size={14} className="nav-icon-sparkle" />
            <span>AI Workspace</span>
          </Link>
          <a href="#standards" className="nav-link-item">
            Standards
          </a>
          <Link to="/chat/certification" className="nav-link-item">
            Certification
          </Link>
          <Link to="/chat/laboratory" className="nav-link-item">
            Laboratories
          </Link>
          <Link to="/chat/hallmarking" className="nav-link-item">
            Hallmarking
          </Link>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          <div className="lang-dropdown-wrapper">
            <button
              type="button"
              className="language-button"
              onClick={() => setLangMenu(!langMenu)}
              aria-label="Select Language"
            >
              <Globe size={14} />
              <span>EN ▾</span>
            </button>
            {langMenu && (
              <div className="lang-menu-popover">
                <button type="button" onClick={() => { setLangMenu(false); navigate('/chat/multilingual'); }}>English</button>
                <button type="button" onClick={() => { setLangMenu(false); navigate('/chat/multilingual'); }}>हिन्दी (Hindi)</button>
                <button type="button" onClick={() => { setLangMenu(false); navigate('/chat/multilingual'); }}>தமிழ் (Tamil)</button>
                <button type="button" onClick={() => { setLangMenu(false); navigate('/chat/multilingual'); }}>More Languages →</button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="login-button"
            onClick={() => navigate('/chat/standards')}
          >
            Sign In
          </button>

          <button
            type="button"
            className="nav-cta"
            onClick={() => navigate('/chat/standards')}
          >
            <span>Launch AI</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
}