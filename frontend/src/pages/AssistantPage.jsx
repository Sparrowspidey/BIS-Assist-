import { useState } from 'react'
import Navbar from '../components/Navbar'
import './AssistantPage.css'

function AssistantPage() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])

  const suggestedQuestions = [
    'Which BIS standard applies to stainless steel water bottles?',
    'How can I get BIS certification for my product?',
    'What are the requirements for BIS hallmarking?',
    'How do I find a BIS recognized laboratory?'
  ]

  const createAIResponse = () => {
    return {
      type: 'ai',
      text:
        'For a stainless steel water bottle, the applicable Indian Standard depends on the product type, material, intended use and applicable BIS requirements. The assistant can identify the relevant standard and explain the requirements using the authorized BIS knowledge base.',

      standards: [
        {
          id: 'IS XXXX : 2025',
          title: 'Relevant Indian Standard',
          relevance: '94% Match'
        }
      ],

      explanation:
        'The recommendation is based on the product description and the information available in the BIS knowledge base.',

      clauses: [
        {
          number: 'Clause 4.2',
          title: 'Material Requirements'
        },
        {
          number: 'Clause 5.1',
          title: 'General Requirements'
        }
      ],

      sources: [
        {
          title: 'BIS Standard Document',
          reference: 'Reference document · Page 18'
        }
      ],

      related: [
        'Related Indian Standards',
        'Certification Requirements',
        'Testing Requirements'
      ]
    }
  }

  const askQuestion = (text) => {
    const userQuestion = text.trim()

    if (!userQuestion) return

    const userMessage = {
      type: 'user',
      text: userQuestion
    }

    const aiMessage = createAIResponse()

    setMessages((previous) => [
      ...previous,
      userMessage,
      aiMessage
    ])

    setQuestion('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    askQuestion(question)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <>
      <Navbar />

      <main className="assistant-page">

        {/* ================= HEADER ================= */}

        <section className="assistant-header">
          <div className="assistant-header-content">

            <span className="assistant-label">
              ✨ BIS INTELLIGENT ASSISTANT
            </span>

            <h1>
              Your AI Guide to
              <span> Indian Standards</span>
            </h1>

            <p>
              Ask questions about BIS standards, certification,
              testing, laboratories and consumer services.
            </p>

            <div className="assistant-trust">
              <span>✓ Source-backed answers</span>
              <span>✓ BIS knowledge</span>
              <span>✓ Natural language</span>
            </div>

          </div>
        </section>

        {/* ================= MAIN ================= */}

        <section className="assistant-main">

          <div className="assistant-layout">

            {/* ================= CHAT ================= */}

            <div className="chat-container">

              <div className="chat-header">

                <div className="chat-title">

                  <div className="chat-ai-icon">
                    ✨
                  </div>

                  <div>
                    <h2>BIS AI Assistant</h2>

                    <span>
                      Intelligent Standards Guide
                    </span>
                  </div>

                </div>

                <div className="chat-header-actions">

                  <span className="online-status">
                    <span></span>
                    Online
                  </span>

                  {messages.length > 0 && (
                    <button
                      className="clear-chat"
                      onClick={clearChat}
                    >
                      Clear
                    </button>
                  )}

                </div>

              </div>

              {/* ================= CHAT BODY ================= */}

              <div className="chat-body">

                {messages.length === 0 ? (

                  <div className="empty-chat">

                    <div className="empty-icon">
                      ✨
                    </div>

                    <h3>
                      How can I help you?
                    </h3>

                    <p>
                      Ask me anything about Indian Standards,
                      BIS certification, testing or compliance.
                    </p>

                    <div className="suggested-questions">

                      <span>
                        Try asking
                      </span>

                      {suggestedQuestions.map((item) => (
                        <button
                          key={item}
                          onClick={() => askQuestion(item)}
                        >
                          {item}

                          <span>
                            →
                          </span>
                        </button>
                      ))}

                    </div>

                  </div>

                ) : (

                  <div className="messages">

                    {messages.map((message, index) => (

                      <div
                        className={
                          message.type === 'user'
                            ? 'message user-message'
                            : 'message ai-message'
                        }
                        key={index}
                      >

                        {message.type === 'ai' && (
                          <div className="message-avatar">
                            ✨
                          </div>
                        )}

                        <div className="message-content">

                          <span className="message-label">
                            {message.type === 'user'
                              ? 'YOU'
                              : 'BIS AI'}
                          </span>

                          <p>
                            {message.text}
                          </p>

                          {/* ================= AI DETAILS ================= */}

                          {message.type === 'ai' && (

                            <div className="ai-response-details">

                              {/* STANDARD */}

                              <div className="answer-standard">

                                <div>

                                  <span className="answer-standard-label">
                                    RELEVANT STANDARD
                                  </span>

                                  <strong>
                                    {message.standards[0].id}
                                  </strong>

                                  <p>
                                    {message.standards[0].title}
                                  </p>

                                </div>

                                <span className="relevance">
                                  {message.standards[0].relevance}
                                </span>

                              </div>

                              {/* WHY */}

                              <div className="explanation-box">

                                <div className="detail-icon">
                                  💡
                                </div>

                                <div>
                                  <strong>
                                    Why this standard?
                                  </strong>

                                  <p>
                                    {message.explanation}
                                  </p>
                                </div>

                              </div>

                              {/* CLAUSES */}

                              <div className="clauses-box">

                                <div className="detail-heading">
                                  <span>
                                    📄
                                  </span>

                                  <strong>
                                    Relevant Clauses
                                  </strong>
                                </div>

                                <div className="clause-list">

                                  {message.clauses.map((clause) => (

                                    <div
                                      className="clause-item"
                                      key={clause.number}
                                    >

                                      <span>
                                        {clause.number}
                                      </span>

                                      <p>
                                        {clause.title}
                                      </p>

                                      <button>
                                        View →
                                      </button>

                                    </div>

                                  ))}

                                </div>

                              </div>

                              {/* SOURCES */}

                              <div className="sources-box">

                                <div className="detail-heading">
                                  <span>
                                    🔗
                                  </span>

                                  <strong>
                                    Sources
                                  </strong>
                                </div>

                                {message.sources.map((source) => (

                                  <div
                                    className="source-item"
                                    key={source.title}
                                  >

                                    <div className="source-document-icon">
                                      📄
                                    </div>

                                    <div>
                                      <strong>
                                        {source.title}
                                      </strong>

                                      <span>
                                        {source.reference}
                                      </span>
                                    </div>

                                    <button>
                                      Open
                                    </button>

                                  </div>

                                ))}

                              </div>

                              {/* RELATED */}

                              <div className="related-box">

                                <div className="detail-heading">
                                  <span>
                                    🔎
                                  </span>

                                  <strong>
                                    Related Information
                                  </strong>
                                </div>

                                <div className="related-list">

                                  {message.related.map((item) => (

                                    <button key={item}>
                                      {item}
                                      <span>
                                        →
                                      </span>
                                    </button>

                                  ))}

                                </div>

                              </div>

                            </div>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

              {/* ================= INPUT ================= */}

              <form
                className="assistant-input-area"
                onSubmit={handleSubmit}
              >

                <div className="input-wrapper">

                  <textarea
                    value={question}
                    onChange={(e) =>
                      setQuestion(e.target.value)
                    }
                    placeholder="Ask about Indian Standards, certification, testing..."
                    rows="1"
                    onKeyDown={(e) => {

                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey
                      ) {
                        e.preventDefault()
                        handleSubmit(e)
                      }

                    }}
                  />

                  <button
                    type="submit"
                    className="send-button"
                    disabled={!question.trim()}
                  >
                    ↑
                  </button>

                </div>

                <div className="input-footer">

                  <span>
                    AI-generated responses should be verified
                    against the cited BIS source.
                  </span>

                  <span>
                    Enter ↵ to send
                  </span>

                </div>

              </form>

            </div>

            {/* ================= SIDEBAR ================= */}

            <aside className="assistant-sidebar">

              {/* CAPABILITIES */}

              <div className="assistant-sidebar-card">

                <span className="sidebar-label">
                  CAPABILITIES
                </span>

                <h3>
                  What can BIS AI help with?
                </h3>

                <div className="capability-list">

                  <div className="capability-item">
                    <div>🔎</div>
                    <span>
                      Find applicable Indian Standards
                    </span>
                  </div>

                  <div className="capability-item">
                    <div>📋</div>
                    <span>
                      Explain certification requirements
                    </span>
                  </div>

                  <div className="capability-item">
                    <div>🧪</div>
                    <span>
                      Understand testing requirements
                    </span>
                  </div>

                  <div className="capability-item">
                    <div>📄</div>
                    <span>
                      Explain standards and clauses
                    </span>
                  </div>

                  <div className="capability-item">
                    <div>💎</div>
                    <span>
                      Guide hallmarking services
                    </span>
                  </div>

                </div>

              </div>

              {/* QUICK ACCESS */}

              <div className="assistant-sidebar-card">

                <span className="sidebar-label">
                  QUICK ACCESS
                </span>

                <h3>
                  Explore Standards
                </h3>

                <p>
                  Browse the BIS standards library and
                  discover standards by category.
                </p>

                <button
                  className="sidebar-button"
                  onClick={() => {
                    window.location.href = '/standards'
                  }}
                >
                  Browse Standards →
                </button>

              </div>

              {/* TRUST */}

              <div className="source-info-card">

                <div className="source-info-icon">
                  📚
                </div>

                <div>

                  <strong>
                    Trusted Knowledge
                  </strong>

                  <p>
                    Answers are designed to reference
                    authoritative BIS information.
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </section>

      </main>
    </>
  )
}
export default AssistantPage