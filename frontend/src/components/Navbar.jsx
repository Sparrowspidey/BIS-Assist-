import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Globe,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import "./Navbar.css";

export default function Navbar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  const closeMenus = () => {
    setLanguageOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">

      {/* ================= NAVBAR ================= */}

      <div className="navbar-container">

        {/* BIS LOGO */}

        <Link
          to="/"
          className="bis-logo-link"
          onClick={closeMenus}
        >
          <img
            src="/bis-logo.png"
            alt="Bureau of Indian Standards"
            className="bis-logo-image"
          />
        </Link>


        {/* ================= DESKTOP NAVIGATION ================= */}

        <div className="desktop-navigation">

          {/* HOME */}

          <Link
            to="/"
            className="nav-item active-nav"
            onClick={closeMenus}
          >
            Home
          </Link>


          {/* STANDARDS */}

          <Link
            to="/chat/standards"
            className="nav-item"
            onClick={closeMenus}
          >
            Standards
            <ChevronDown size={11} />
          </Link>


          {/* CERTIFICATION */}

          <Link
            to="/chat/certification"
            className="nav-item"
            onClick={closeMenus}
          >
            Certification
            <ChevronDown size={11} />
          </Link>


          {/* LABORATORIES */}

          <Link
            to="/chat/laboratory"
            className="nav-item"
            onClick={closeMenus}
          >
            Laboratories
            <ChevronDown size={11} />
          </Link>


          {/* HALLMARKING */}

          <Link
            to="/chat/hallmarking"
            className="nav-item"
            onClick={closeMenus}
          >
            Hallmarking
            <ChevronDown size={11} />
          </Link>


          {/* LANGUAGE */}

          <div className="language-wrapper">

            <button
              type="button"
              className="language-nav-button"
              onClick={() => {
                setLanguageOpen(!languageOpen);
              }}
            >
              <Globe size={13} />

              <span>Language</span>

              <ChevronDown
                size={10}
                className={
                  languageOpen ? "chevron-open" : ""
                }
              />
            </button>


            {languageOpen && (
              <div className="language-menu">

                <div className="language-title">
                  SELECT LANGUAGE
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    navigate("/chat/multilingual");
                  }}
                >
                  🇬🇧 English
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    navigate("/chat/multilingual");
                  }}
                >
                  🇮🇳 हिन्दी
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    navigate("/chat/multilingual");
                  }}
                >
                  🇮🇳 தமிழ்
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    navigate("/chat/multilingual");
                  }}
                >
                  🇮🇳 ಕನ್ನಡ
                </button>

                <button
                  type="button"
                  className="all-languages"
                  onClick={() => {
                    closeMenus();
                    navigate("/chat/multilingual");
                  }}
                >
                  <span>More Languages</span>
                  <ArrowRight size={12} />
                </button>

              </div>
            )}

          </div>


          {/* ASK AI */}

          <button
            type="button"
            className="ask-ai-button"
            onClick={() => {
              closeMenus();
              navigate("/chat/standards");
            }}
          >
            <Sparkles size={13} />
            <span>ASK AI</span>
          </button>


          {/* ASHOKA EMBLEM */}

          <div className="ashoka-emblem">

            <img
              src="/ashoka-pillar.png"
              alt="State Emblem of India"
              className="ashoka-emblem-image"
            />

          </div>

        </div>


        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setLanguageOpen(false);
          }}
          aria-label="Open navigation"
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>


      {/* ================= MOBILE NAVIGATION ================= */}

      {mobileOpen && (

        <div className="mobile-navigation">

          <Link
            to="/"
            onClick={closeMenus}
          >
            Home
          </Link>

          <Link
            to="/standards"
            onClick={closeMenus}
          >
            Standards
          </Link>

          <Link
            to="/chat/certification"
            onClick={closeMenus}
          >
            Certification
          </Link>

          <Link
            to="/chat/laboratory"
            onClick={closeMenus}
          >
            Laboratories
          </Link>

          <Link
            to="/chat/hallmarking"
            onClick={closeMenus}
          >
            Hallmarking
          </Link>

          <Link
            to="/chat/multilingual"
            onClick={closeMenus}
          >
            🌐 Language
          </Link>


          {/* MOBILE ASK AI */}

          <button
            type="button"
            className="mobile-ai-button"
            onClick={() => {
              closeMenus();
              navigate("/chat/standards");
            }}
          >
            <Sparkles size={14} />
            ASK BIS AI
          </button>


          {/* MOBILE EMBLEM */}

          <div className="mobile-emblem">

            <img
              src="/ashoka-pillar.png"
              alt="State Emblem of India"
              className="mobile-emblem-image"
            />

            <span>
              Government of India
            </span>

          </div>

        </div>

      )}

    </nav>
  );
}