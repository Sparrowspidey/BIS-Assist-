import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ChatActions({ textToCopy = '', onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleFeedback = (type) => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  return (
    <div className="chat-actions-row">
      {/* Copy Button */}
      <button
        type="button"
        className={`chat-action-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title="Copy response to clipboard"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {/* Regenerate Button */}
      {onRegenerate && (
        <button
          type="button"
          className="chat-action-btn"
          onClick={onRegenerate}
          title="Regenerate this response"
        >
          <RotateCcw size={14} />
          <span>Regenerate</span>
        </button>
      )}

      <span className="actions-separator">|</span>

      {/* Helpful (Thumbs Up) */}
      <button
        type="button"
        className={`chat-action-btn icon-only ${feedback === 'like' ? 'active-like' : ''}`}
        onClick={() => handleFeedback('like')}
        title="Helpful response"
        aria-label="Helpful response"
      >
        <ThumbsUp size={14} />
      </button>

      {/* Not Helpful (Thumbs Down) */}
      <button
        type="button"
        className={`chat-action-btn icon-only ${feedback === 'dislike' ? 'active-dislike' : ''}`}
        onClick={() => handleFeedback('dislike')}
        title="Not helpful"
        aria-label="Not helpful"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}
