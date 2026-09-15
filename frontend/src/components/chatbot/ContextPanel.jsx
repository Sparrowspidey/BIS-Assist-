import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  Award,
  FlaskConical,
  ShieldCheck,
  Languages,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

export default function ContextPanel({ domainConfig, onClose, isOpen }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const context = domainConfig.contextPanel || {};

  if (!isOpen) return null;

  return (
    <aside className="chat-context-panel">
      {/* Header */}
      <div className="context-panel-header">
        <div className="context-title-group">
          <span className="context-top-label">WORKSPACE CONTEXT</span>
          <h2 className="context-main-heading">{context.heading || domainConfig.title}</h2>
        </div>
        <button
          type="button"
          className="context-close-btn"
          onClick={onClose}
          title="Close context panel"
          aria-label="Close context panel"
        >
          <X size={17} />
        </button>
      </div>

      {/* Content Container */}
      <div className="context-scroll-body">
        {/* Badge Card */}
        {context.badge && (
          <div className="context-badge-card">
            <Sparkles size={14} className="context-badge-icon" />
            <span>{context.badge}</span>
          </div>
        )}

        {/* 1. STANDARDS CONTEXT */}
        {context.type === 'standards' && context.standards && (
          <div className="context-section-block">
            <span className="section-block-title">IDENTIFIED STANDARDS</span>
            <div className="standards-cards-stack">
              {context.standards.map((std, i) => (
                <div key={i} className="std-context-card">
                  <div className="std-card-top">
                    <strong className="std-card-code">{std.code}</strong>
                    <span className="std-relevance-pill">{std.relevance}% Match</span>
                  </div>
                  <p className="std-card-title">{std.title}</p>
                  <div className="std-card-meta">
                    <span className="std-meta-status">{std.status}</span>
                    <span className="std-meta-clause">{std.clause}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. CERTIFICATION CONTEXT */}
        {context.type === 'certification' && context.steps && (
          <div className="context-section-block">
            <span className="section-block-title">CERTIFICATION PROGRESSION</span>
            <div className="certification-steps-timeline">
              {context.steps.map((step, idx) => (
                <div key={idx} className={`timeline-step-item ${step.status}`}>
                  <div className="step-number-circle">
                    {step.status === 'completed' ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </div>
                  <div className="step-content">
                    <div className="step-title-row">
                      <strong className="step-title">{step.title}</strong>
                      <span className={`step-badge ${step.status}`}>{step.status}</span>
                    </div>
                    <p className="step-description">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LABORATORY CONTEXT */}
        {context.type === 'laboratory' && context.labs && (
          <div className="context-section-block">
            <span className="section-block-title">ACCREDITED TEST FACILITIES</span>
            <div className="labs-cards-stack">
              {context.labs.map((lab, idx) => (
                <div key={idx} className="lab-context-card">
                  <div className="lab-card-header">
                    <strong className="lab-name">{lab.name}</strong>
                    <span className="lab-badge">{lab.badge}</span>
                  </div>
                  <p className="lab-location">{lab.location}</p>
                  <div className="lab-scope-box">
                    <span className="lab-scope-label">Capability:</span>
                    <span className="lab-scope-text">{lab.scope}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. HALLMARKING CONTEXT */}
        {context.type === 'hallmarking' && (
          <div className="context-section-block">
            <span className="section-block-title">PURITY & FINENESS STANDARDS</span>
            <div className="purity-table-card">
              <div className="purity-table-header">
                <span>Carat</span>
                <span>Fineness</span>
                <span>Application</span>
              </div>
              {context.purityList?.map((p, idx) => (
                <div key={idx} className="purity-table-row">
                  <strong className="purity-carat">{p.carat}</strong>
                  <span className="purity-fineness">{p.fineness}</span>
                  <span className="purity-desc">{p.desc}</span>
                </div>
              ))}
            </div>

            {context.hallmarkComponents && (
              <div className="hallmark-marks-breakdown">
                <span className="section-block-title">3 MANDATORY HALLMARKS</span>
                <div className="hallmarks-list">
                  {context.hallmarkComponents.map((item, idx) => (
                    <div key={idx} className="hallmark-mark-item">
                      <Award size={15} className="hallmark-icon" />
                      <div>
                        <strong>{item.mark}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. CONSUMER CONTEXT */}
        {context.type === 'consumer' && context.resources && (
          <div className="context-section-block">
            <span className="section-block-title">CONSUMER PROTECTION UTILITIES</span>
            <div className="consumer-resources-list">
              {context.resources.map((res, idx) => (
                <div key={idx} className="consumer-res-card">
                  <ShieldCheck size={16} className="res-icon" />
                  <div className="res-body">
                    <strong className="res-title">{res.title}</strong>
                    <p className="res-desc">{res.desc}</p>
                    {res.action && (
                      <span className="res-action-tag">{res.action}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MULTILINGUAL CONTEXT */}
        {context.type === 'multilingual' && context.languages && (
          <div className="context-section-block">
            <span className="section-block-title">INDIAN LANGUAGES SELECTOR</span>
            <div className="languages-chips-grid">
              {context.languages.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    className={`lang-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedLang(lang.code)}
                  >
                    <span className="lang-native">{lang.native}</span>
                    <span className="lang-name">{lang.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="lang-info-banner">
              <Info size={14} />
              <span>
                Active: <strong>{context.languages.find(l => l.code === selectedLang)?.name}</strong>. Natural dialect translation enabled.
              </span>
            </div>
          </div>
        )}

        {/* Quick Actions at bottom of context panel */}
        {context.quickActions && context.quickActions.length > 0 && (
          <div className="context-quick-actions-section">
            <span className="section-block-title">QUICK ACTIONS</span>
            <div className="quick-actions-list">
              {context.quickActions.map((qa, idx) => (
                <a
                  key={idx}
                  href={qa.url}
                  target={qa.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="quick-action-link"
                >
                  <span>{qa.label}</span>
                  <ChevronRight size={14} className="action-arrow" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
