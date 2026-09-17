
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  ShieldCheck,
  FlaskConical,
  Gem,
  Users,
  FileText,
} from "lucide-react";

import "./Hero.css";

export default function Hero() {
  

  return (
    <section className="bis-hero">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="hero-sky"></div>
      <div className="hero-light hero-light-blue"></div>
      <div className="hero-light hero-light-orange"></div>

      <div className="bis-hero-inner">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="bis-hero-content">

          <div className="bis-hero-eyebrow">
            <span>🇮🇳</span>
            BUREAU OF INDIAN STANDARDS
          </div>

          <h1>
            Building Trust Through
            <br />
            <span>Indian Standards</span>
          </h1>

          <p>
            Explore Indian Standards, understand BIS certification,
            find testing laboratories, verify hallmarking and access
            reliable information — all in one place.
          </p>

          {/* =================================================
              HERO BUTTONS
          ================================================= */}

          <div className="bis-hero-buttons">

            <button
              className="bis-ask-button"
              
            >
              <Sparkles size={18} />
              <span>Ask BIS AI</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="bis-explore-button"
              
            >
              <span>Explore Standards</span>
              <ArrowRight size={18} />
            </button>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="bis-hero-stats">

            <div className="bis-stat">

              <div className="bis-stat-icon">
                <FileText size={21} />
              </div>

              <div>
                <strong>10,000+</strong>
                <span>Indian Standards</span>
              </div>

            </div>

            <div className="bis-stat-divider"></div>

            <div className="bis-stat">

              <div className="bis-stat-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <strong>4+</strong>
                <span>Core Services</span>
              </div>

            </div>

            <div className="bis-stat-divider"></div>

            <div className="bis-stat">

              <div className="bis-stat-icon">
                <Users size={21} />
              </div>

              <div>
                <strong>AI</strong>
                <span>Assisted Discovery</span>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <div className="bis-hero-visual">

          {/* DECORATIVE RINGS */}

          <div className="hero-ring ring-1"></div>
          <div className="hero-ring ring-2"></div>
          <div className="hero-ring ring-3"></div>


          {/* =================================================
              SERVICE CARD - STANDARDS
              FIXED / NON-CLICKABLE
          ================================================= */}

          <div className="hero-service-card service-standards">

            <div className="hero-service-icon blue">
              <BookOpen size={23} />
            </div>

            <div className="hero-service-text">
              <strong>Standards</strong>

              <span>
                Quality for
                <br />
                a better tomorrow
              </span>
            </div>

          </div>


          {/* =================================================
              SERVICE CARD - CERTIFICATION
              FIXED / NON-CLICKABLE
          ================================================= */}

          <div className="hero-service-card service-certification">

            <div className="hero-service-icon green">
              <ShieldCheck size={23} />
            </div>

            <div className="hero-service-text">
              <strong>Certification</strong>

              <span>
                Assurance
                <br />
                of quality
              </span>
            </div>

          </div>


          {/* =================================================
              SERVICE CARD - LABORATORIES
              FIXED / NON-CLICKABLE
          ================================================= */}

          <div className="hero-service-card service-laboratory">

            <div className="hero-service-icon purple">
              <FlaskConical size={23} />
            </div>

            <div className="hero-service-text">
              <strong>Laboratories</strong>

              <span>
                Accurate &
                <br />
                reliable testing
              </span>
            </div>

          </div>


          {/* =================================================
              SERVICE CARD - HALLMARKING
              FIXED / NON-CLICKABLE
          ================================================= */}

          <div className="hero-service-card service-hallmarking">

            <div className="hero-service-icon orange">
              <Gem size={23} />
            </div>

            <div className="hero-service-text">
              <strong>Hallmarking</strong>

              <span>
                Purity you
                <br />
                can trust
              </span>
            </div>

          </div>


          {/* =================================================
              CENTRAL BIS LOGO
          ================================================= */}

          <div className="bis-central-logo">

            <div className="bis-logo-glow"></div>

            <div className="bis-logo-white">

              <div className="bis-mark">

                <div className="bis-mark-triangle">

                  <div className="bis-mark-inner"></div>

                  <div className="bis-mark-dot"></div>

                </div>

              </div>

              <div className="bis-logo-word">
                BIS
              </div>

            </div>

          </div>


          {/* =================================================
              INDIA / INDUSTRY VISUAL
          ================================================= */}

          <div className="hero-india-visual">

            <div className="industry-factory">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            <div className="industry-city">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="industry-hills"></div>

            <div className="product product-bottle"></div>

            <div className="product product-box"></div>

            <div className="product product-camera"></div>

          </div>


          {/* =================================================
              TRICOLOR WAVE
          ================================================= */}

          <div className="tricolor-wave">

            <div className="wave saffron-wave"></div>

            <div className="wave white-wave"></div>

            <div className="wave green-wave"></div>

          </div>


          {/* =================================================
              SLOGAN
          ================================================= */}

          <div className="hero-india-slogan">

            <span>
              Standardization for a stronger
            </span>

            <strong>
              India
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
}