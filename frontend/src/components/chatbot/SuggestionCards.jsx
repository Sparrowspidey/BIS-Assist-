import React from 'react';
import {
  Search,
  Hash,
  BookOpen,
  GitCompare,
  HelpCircle,
  Layers,
  FileText,
  Clock,
  MapPin,
  TestTube,
  Navigation,
  FileCheck,
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Languages,
  MessageSquare,
  Globe,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Search,
  Hash,
  BookOpen,
  GitCompare,
  HelpCircle,
  Layers,
  FileText,
  Clock,
  MapPin,
  TestTube,
  Navigation,
  FileCheck,
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Languages,
  MessageSquare,
  Globe
};

export default function SuggestionCards({ suggestions = [], onSelectSuggestion }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestions-grid">
      {suggestions.map((item, index) => {
        const IconComponent = iconMap[item.icon] || Search;
        return (
          <button
            key={index}
            type="button"
            className="suggestion-card"
            onClick={() => onSelectSuggestion(item)}
            title={`Ask: "${item.query}"`}
          >
            <div className="suggestion-icon-box">
              <IconComponent size={18} />
            </div>
            <div className="suggestion-body">
              <strong className="suggestion-title">{item.title}</strong>
              <span className="suggestion-desc">{item.desc}</span>
            </div>
            <span className="suggestion-arrow">
              <ArrowRight size={15} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
