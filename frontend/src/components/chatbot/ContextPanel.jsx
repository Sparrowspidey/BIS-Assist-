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

export default function ContextPanel({
  domainConfig,
  onClose,
  isOpen,
  sources = [],
  labs = []
}) {
  const [selectedLang, setSelectedLang] = useState('en');
  const context = domainConfig.contextPanel || {};
  const liveSources = Array.isArray(sources) ? sources : [];
  const liveLabs = Array.isArray(labs) ? labs : [];
 

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

       {/* 1. LIVE STANDARDS CONTEXT */}
{context.type === 'standards' && (
  <div className="context-section-block">
    <span className="section-block-title">
      {liveSources.length > 0
        ? 'RETRIEVED SOURCES'
        : 'NO SOURCES RETRIEVED'}
    </span>

    {liveSources.length > 0 ? (
      <div className="standards-cards-stack">
        {liveSources.map((source, i) => {
          const standardCode =
            source.standard_id ||
            source.code ||
            source.standard ||
            'BIS Source';

          const title =
            source.document_title ||
            source.title ||
            'BIS Standard Document';

          const clause =
            source.clause ||
            '';

          const snippet =
            source.snippet ||
            source.text ||
            '';

          return (
            <div key={i} className="std-context-card">
              <div className="std-card-top">
                <strong className="std-card-code">
                  {standardCode}
                </strong>
              </div>

              <p className="std-card-title">
                {title}
              </p>

              {snippet && (
                <p className="std-card-snippet">
                  {snippet}
                </p>
              )}

              <div className="std-card-meta">
                {clause && (
                  <span className="std-meta-clause">
                    {clause}
                  </span>
                )}

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="std-source-link"
                  >
                    View source
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="context-empty-state">
        <FileText size={18} />
        <p>
          No source documents were returned for this query.
        </p>
      </div>
    )}
  </div>
)}

       {/* 2. LIVE CERTIFICATION SOURCES */}
{context.type === 'certification' && (
  <div className="context-section-block">
    <span className="section-block-title">
      {liveSources.length > 0
        ? 'RETRIEVED SOURCES'
        : 'NO SOURCES RETRIEVED'}
    </span>

    {liveSources.length > 0 ? (
      <div className="standards-cards-stack">
        {liveSources.map((source, i) => {
          const title =
            source.document_title ||
            source.title ||
            'BIS Certification Document';

          const standardCode =
            source.standard_id ||
            source.code ||
            source.standard ||
            'BIS Source';

          const clause =
            source.clause ||
            '';

          const snippet =
            source.snippet ||
            source.text ||
            '';

          return (
            <div key={i} className="std-context-card">
              <div className="std-card-top">
                <strong className="std-card-code">
                  {standardCode}
                </strong>
              </div>

              <p className="std-card-title">
                {title}
              </p>

              {snippet && (
                <p className="std-card-snippet">
                  {snippet}
                </p>
              )}

              <div className="std-card-meta">
                {clause && (
                  <span className="std-meta-clause">
                    {clause}
                  </span>
                )}

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="std-source-link"
                  >
                    View source
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="context-empty-state">
        <FileText size={18} />
        <p>
          No source documents were returned for this query.
        </p>
      </div>
    )}
  </div>
)}

{/* 3. LIVE LABORATORY CONTEXT */}
{context.type === 'laboratory' && (
  <div className="context-section-block">
    <span className="section-block-title">
      {liveLabs.length > 0
        ? 'MATCHING TEST FACILITIES'
        : 'NO LABS FOUND'}
    </span>

    {liveLabs.length > 0 ? (
      <div className="labs-cards-stack">
        {liveLabs.map((lab, idx) => (
          <div key={idx} className="lab-context-card">
            <div className="lab-card-header">
              <strong className="lab-name">
                {lab.name}
              </strong>

              <span className="lab-badge">
                OSL
              </span>
            </div>

            <p className="lab-location">
              {lab.state}
            </p>

<div className="lab-scope-box">
  <span className="lab-scope-label">
    OSL Code:
  </span>

  <span className="lab-scope-text">
    {lab.osl_code || 'Not available'}
  </span>
</div>

{lab.source_url && (
  <a
    href={lab.source_url}
    target="_blank"
    rel="noreferrer"
    className="std-source-link"
  >
    View source
    <ExternalLink size={12} />
  </a>
)}
          </div>
        ))}
      </div>
    ) : (
      <div className="context-empty-state">
        <FileText size={18} />
        <p>
          No matching laboratories were returned for this query.
        </p>
      </div>
    )}
  </div>
)}

{/* 4. HALLMARKING CONTEXT */}
{context.type === 'hallmarking' && (
  <div className="context-section-block">
    <span className="section-block-title">
      {liveSources.length > 0
        ? 'RETRIEVED SOURCES'
        : 'NO SOURCES RETRIEVED'}
    </span>

    {liveSources.length > 0 ? (
      <div className="standards-cards-stack">
        {liveSources.map((source, i) => {
          const title =
            source.document_title ||
            source.title ||
            'BIS Hallmarking Source';

          const standardCode =
            source.standard_id ||
            source.code ||
            source.standard ||
            'BIS Source';

          const clause =
            source.clause ||
            '';

          const snippet =
            source.snippet ||
            source.text ||
            '';

          return (
            <div key={i} className="std-context-card">
              <div className="std-card-header">
                <span className="std-card-code">
                  {standardCode}
                </span>

                {clause && (
                  <span className="std-card-clause">
                    {clause}
                  </span>
                )}
              </div>

              <h4 className="std-card-title">
                {title}
              </h4>

              {snippet && (
                <p className="std-card-snippet">
                  {snippet}
                </p>
              )}

              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="std-card-link"
                >
                  View source <ExternalLink size={13} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="context-empty-state">
        <FileText size={18} />
        <p>
          No BIS source documents were returned for this query.
        </p>
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
