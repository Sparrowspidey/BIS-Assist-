import React from 'react';
import './AIOrb.css';

/**
 * Premium 3D Glossy AI Orb
 * Rendered using multi-layer CSS gradients, specular reflections, inner refracted glow,
 * and delicate floating animations.
 */
export default function AIOrb({ size = 'lg', theme = 'standards', animated = true, className = '' }) {
  return (
    <div className={`ai-orb-container ai-orb-${size} ai-orb-theme-${theme} ${className}`}>
      {/* Outer ambient glow field */}
      <div className="ai-orb-ambient-glow" />
      
      {/* 3D Glass Sphere Body */}
      <div className={`ai-orb-sphere ${animated ? 'ai-orb-floating' : ''}`}>
        {/* Deep internal multi-color fluid gradient */}
        <div className="ai-orb-core" />

        {/* Dynamic color vortex / swirls */}
        <div className="ai-orb-vortex-1" />
        <div className="ai-orb-vortex-2" />
        <div className="ai-orb-vortex-3" />

        {/* Inner shadow & rim lighting */}
        <div className="ai-orb-inner-shadow" />

        {/* Glass specular highlights & top reflection curve */}
        <div className="ai-orb-specular-primary" />
        <div className="ai-orb-specular-secondary" />

        {/* Center intelligence pulse icon or symbol */}
        <div className="ai-orb-center-mark">
          <span className="ai-orb-sparkle">✦</span>
        </div>
      </div>
    </div>
  );
}
