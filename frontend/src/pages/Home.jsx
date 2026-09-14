import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Assistant from '../components/Assistant';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="landing-page-wrapper">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Assistant />
      </main>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-brand-title">BIS SmartStandards</span>
            <p className="footer-brand-desc">
              National Standards Body of India · Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food & Public Distribution.
            </p>
          </div>

          <div className="footer-links-row">
            <Link to="/chat/standards">Standards Discovery</Link>
            <Link to="/chat/certification">Certification Guidance</Link>
            <Link to="/chat/laboratory">Laboratory Finder</Link>
            <Link to="/chat/hallmarking">Hallmarking Guidance</Link>
            <Link to="/chat/consumer">Consumer Support</Link>
            <Link to="/chat/multilingual">Multilingual</Link>
          </div>
        </div>

        <div className="footer-copyright-row">
          <span>© {new Date().getFullYear()} Bureau of Indian Standards. SmartStandards AI Assistant.</span>
          <span>Source-Backed Statutory Guidance · All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}