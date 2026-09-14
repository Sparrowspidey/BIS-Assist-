import { useState } from 'react'
import Navbar from '../components/Navbar'
import './Multilingual.css'

function Multilingual() {
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [question, setQuestion] = useState('')

  const languages = [
    {
      name: 'English',
      native: 'English',
      code: 'EN',
      icon: 'A'
    },
    {
      name: 'Hindi',
      native: 'हिन्दी',
      code: 'HI',
      icon: 'हि'
    },
    {
      name: 'Telugu',
      native: 'తెలుగు',
      code: 'TE',
      icon: 'తె'
    },
    {
      name: 'Kannada',
      native: 'ಕನ್ನಡ',
      code: 'KN',
      icon: 'ಕ'
    },
    {
      name: 'Malayalam',
      native: 'മലയാളം',
      code: 'ML',
      icon: 'മ'
    },
    {
      name: 'Tamil',
      native: 'தமிழ்',
      code: 'TA',
      icon: 'த'
    },
    {
      name: 'Marathi',
      native: 'मराठी',
      code: 'MR',
      icon: 'म'
    },
    {
      name: 'Bengali',
      native: 'বাংলা',
      code: 'BN',
      icon: 'ব'
    }
  ]

  const handleAsk = (e) => {
    e.preventDefault()

    if (!question.trim()) return

    alert(
      `Your question will be processed in ${selectedLanguage}.`
    )
  }

  return (
    <>
      <Navbar />

      <main className="multilingual-page">

        {/* HERO */}

        <section className="multilingual-hero">

          <div className="multilingual-hero-content">

            <span className="multilingual-label">
              🌐 MULTILINGUAL BIS ASSISTANCE
            </span>

            <h1>
              BIS guidance in
              <span> your language</span>
            </h1>

            <p>
              Ask questions about Indian Standards, certification,
              laboratories and BIS services in a language you are
              comfortable with.
            </p>

            <div className="language-count">
              <strong>8+</strong>
              <span>Indian languages supported</span>
            </div>

          </div>

        </section>


        {/* LANGUAGE SECTION */}

        <section className="multilingual-main">

          <div className="multilingual-container">

            <div className="multilingual-heading">

              <div>
                <span className="section-label">
                  CHOOSE YOUR LANGUAGE
                </span>

                <h2>
                  How would you like to interact?
                </h2>
              </div>

              <p>
                Select a language to communicate with BIS Assist
                naturally and comfortably.
              </p>

            </div>


            {/* LANGUAGE CARDS */}

            <div className="language-grid">

              {languages.map((language) => (

                <button
                  key={language.code}
                  className={
                    selectedLanguage === language.name
                      ? 'language-card active'
                      : 'language-card'
                  }
                  onClick={() =>
                    setSelectedLanguage(language.name)
                  }
                >

                  <div className="language-icon">
                    {language.icon}
                  </div>

                  <div className="language-info">

                    <strong>
                      {language.name}
                    </strong>

                    <span>
                      {language.native}
                    </span>

                  </div>

                  <span className="language-code">
                    {language.code}
                  </span>

                </button>

              ))}

            </div>


            {/* ASSISTANT PREVIEW */}

            <section className="multilingual-assistant">

              <div className="assistant-preview-header">

                <div className="assistant-preview-title">

                  <div className="assistant-preview-icon">
                    ✨
                  </div>

                  <div>
                    <strong>
                      BIS AI Assistant
                    </strong>

                    <span>
                      Responding in {selectedLanguage}
                    </span>
                  </div>

                </div>

                <div className="assistant-online">
                  <span></span>
                  Online
                </div>

              </div>


              <div className="assistant-preview-body">

                <div className="preview-ai-message">

                  <div className="preview-avatar">
                    ✨
                  </div>

                  <div className="preview-message">

                    <span className="preview-label">
                      BIS ASSIST
                    </span>

                    <p>
                      Hello! I can help you understand
                      Indian Standards, certification,
                      laboratory services and other
                      BIS-related information.
                    </p>

                  </div>

                </div>


                <div className="preview-user-message">

                  <span>
                    Ask your question in {selectedLanguage}
                  </span>

                </div>

              </div>


              <form
                className="multilingual-input"
                onSubmit={handleAsk}
              >

                <input
                  type="text"
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  placeholder={`Type your question in ${selectedLanguage}...`}
                />

                <button type="submit">
                  ↑
                </button>

              </form>

            </section>


            {/* FEATURES */}

            <div className="multilingual-features">

              <div className="multilingual-feature">

                <div className="multilingual-feature-icon">
                  💬
                </div>

                <h3>
                  Natural conversations
                </h3>

                <p>
                  Ask questions naturally instead of
                  searching through complex technical documents.
                </p>

              </div>


              <div className="multilingual-feature">

                <div className="multilingual-feature-icon">
                  📚
                </div>

                <h3>
                  Source-backed answers
                </h3>

                <p>
                  Responses can be connected to authorized
                  BIS knowledge sources and relevant references.
                </p>

              </div>


              <div className="multilingual-feature">

                <div className="multilingual-feature-icon">
                  🇮🇳
                </div>

                <h3>
                  Built for India
                </h3>

                <p>
                  Make BIS information more accessible to
                  consumers, industries and professionals.
                </p>

              </div>

            </div>


            {/* CTA */}

            <section className="multilingual-cta">

              <div className="multilingual-cta-icon">
                ✨
              </div>

              <div className="multilingual-cta-content">

                <span>
                  BIS AI ASSISTANT
                </span>

                <h2>
                  Ready to ask your question?
                </h2>

                <p>
                  Choose your preferred language and
                  start a conversation with BIS Assist.
                </p>

              </div>

              <button
                onClick={() => {
                  window.location.href = '/assistant'
                }}
              >
                Open BIS AI →
              </button>

            </section>

          </div>

        </section>

      </main>
    </>
  )
}

export default Multilingual