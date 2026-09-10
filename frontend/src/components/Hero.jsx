function Hero() {
  return (
    <section className="hero-section">

      {/* Left side */}
      <div className="hero-content">

        <div className="eyebrow">
          🇮🇳 BUREAU OF INDIAN STANDARDS
        </div>

        <h1>
          Intelligence for India's
          <span> Standards Ecosystem</span>
        </h1>

        <p>
          Discover Indian Standards, understand BIS services,
          and get accurate answers backed by trusted sources.
        </p>

        <div className="hero-buttons">

          <button className="primary-button">
            ✨ Ask BIS AI
          </button>

          <button className="secondary-button">
            Explore Standards →
          </button>

        </div>

        <div className="trust-row">

          <div>
            <strong>10K+</strong>
            <span>Standards</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Powered</span>
          </div>

          <div>
            <strong>✓</strong>
            <span>Source-backed</span>
          </div>

        </div>

      </div>


      {/* Right side */}
      <div className="hero-visual">

        <div className="ai-card">

          <div className="ai-card-header">

            <div className="ai-icon">
              ✨
            </div>

            <div>
              <strong>BIS AI Assistant</strong>
              <span>Intelligent Standards Guide</span>
            </div>

            <div className="online-dot">
              ●
            </div>

          </div>


          <div className="question-bubble">
            Which BIS standard applies to
            stainless steel water bottles?
          </div>


          <div className="ai-answer">

            <div className="answer-label">
              AI ANALYSIS
            </div>

            <h3>
              Relevant Standard Identified
            </h3>

            <div className="standard-result">

              <div>
                <strong>IS XXXX : 2025</strong>
                <span>
                  Stainless Steel Water Bottles
                </span>
              </div>

              <div className="match">
                94%
              </div>

            </div>


            <div className="source-row">

              <span>📄 Source</span>

              <span>
                Clause 4.2 · Page 18
              </span>

            </div>

          </div>


          <div className="ai-input">
            <span>Ask anything about BIS...</span>
            <button>↑</button>
          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero