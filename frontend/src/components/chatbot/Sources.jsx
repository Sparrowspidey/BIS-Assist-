import React from 'react';
import { FileText, ExternalLink, BookmarkCheck } from 'lucide-react';

export default function Sources({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="message-sources-wrapper">
      <div className="sources-header">
        <BookmarkCheck size={14} className="sources-header-icon" />
        <span className="sources-heading-text">Official BIS Sources & Citations</span>
      </div>

      <div className="sources-cards-list">
        {sources.map((src, index) => (
          <div key={index} className="source-citation-card">
            <div className="source-icon-container">
              <FileText size={16} />
            </div>
            <div className="source-details">
              <div className="source-code-title">
                <strong>{src.code}</strong>
              </div>
              <div className="source-clause-meta">
                <span>{src.clause}</span>
                {src.page && <span className="source-dot-sep">·</span>}
                {src.page && <span>{src.page}</span>}
              </div>
            </div>
            <a
              href="https://www.standardsbis.in"
              target="_blank"
              rel="noreferrer"
              className="source-action-link"
              title={`View official gazette/standard for ${src.code}`}
            >
              <span>View source</span>
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
