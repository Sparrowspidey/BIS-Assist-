<<<<<<< HEAD
function FeatureCard({ icon, title, description, path }) {
  return (
    <div className="feature-card">

=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ icon, title, description, route, accent = 'blue' }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route) navigate(route);
  };

  return (
    <div
      className={`feature-card feature-card-${accent}`}
      onClick={handleCardClick}
      title={`Open ${title} AI Workspace`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
      <div className="feature-icon">
        {icon}
      </div>

      <h3 className="feature-title">{title}</h3>

      <p className="feature-description">{description}</p>

<<<<<<< HEAD
      <a
        href={path}
        className="feature-link"
      >
        Explore →
      </a>

=======
      <button
        type="button"
        className="feature-link"
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        <span>Explore</span>
        <ArrowRight size={15} className="feature-link-arrow" />
      </button>
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    </div>
  );
}