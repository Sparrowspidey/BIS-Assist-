import { useState } from 'react'
import './Assistant.css'
function Assistant() {

  const [question, setQuestion] = useState('')

  const [asked, setAsked] = useState(false)

  const handleAsk = () => {
    if (!question.trim()) return

    setAsked(true)
  }

  return (
    <section className="assistant-section" id="assistant">

      <div className="assistant-heading">

        <span className="section-label">
          BIS AI ASSISTANT
        </span>

        <h2>
          Ask anything about
          <span> Indian Standards</span>
        </h2>

        <p>
          Get intelligent, source-backed guidance across
          standards, certification, testing and BIS services.
        </p>

      </div>


      <div className="assistant-container">

        <div className="assistant-box">

          <div className="assistant-top">

            <div className="assistant-avatar">
              ✨
            </div>

            <div>
              <strong>BIS Intelligence</strong>
              <span>AI-powered standards assistant</span>
            </div>

            <div className="assistant-status">
              <span></span>
              Online
            </div>

          </div>


          <div className="assistant-body">

            {!asked ? (

              <div className="assistant-empty">

                <div className="big-ai-icon">
                  ✨
                </div>

                <h3>
                  How can I help you today?
                </h3>

                <p>
                  Ask about Indian Standards, certification,
                  laboratories, hallmarking or BIS services.
                </p>

              </div>

            ) : (

              <div className="conversation">

                <div className="user-message">
                  {question}
                </div>

                <div className="ai-message">

                  <div className="ai-message-header">
                    <span>✨</span>
                    BIS AI
                  </div>

                  <h3>
                    Relevant Standard Identified
                  </h3>

                  <p>
                    Based on your query, this standard appears
                    relevant to your product.
                  </p>

                  <div className="standard-card">

                    <div>
                      <span className="result-label">
                        INDIAN STANDARD
                      </span>

                      <strong>
                        IS XXXX : 2025
                      </strong>

                      <p>
                        Stainless Steel Water Bottles
                      </p>
                    </div>

                    <div className="match-score">
                      <strong>94%</strong>
                      <span>Match</span>
                    </div>

                  </div>

                  <div className="source-card">

                    <span>📄</span>

                    <div>
                      <strong>
                        Source Reference
                      </strong>

                      <p>
                        Clause 4.2 · Page 18
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>


          <div className="suggestions">

            <span>Try asking</span>

            <button
              onClick={() =>
                setQuestion(
                  'Which BIS standard applies to steel water bottles?'
                )
              }
            >
              Find a standard
            </button>

            <button
              onClick={() =>
                setQuestion(
                  'What are the BIS certification requirements?'
                )
              }
            >
              Certification
            </button>

            <button
              onClick={() =>
                setQuestion(
                  'How can I find a BIS testing laboratory?'
                )
              }
            >
              Testing laboratory
            </button>

          </div>


          <div className="assistant-input">

            <input
              type="text"
              placeholder="Ask anything about BIS..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAsk()
                }
              }}
            />

            <button onClick={handleAsk}>
              ↑
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Assistant