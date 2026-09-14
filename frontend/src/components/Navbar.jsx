import { useState } from 'react'

function Navbar() {
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { name: 'English', code: 'EN' },
    { name: 'हिन्दी', code: 'HI' },
    { name: 'తెలుగు', code: 'TE' },
    { name: 'ಕನ್ನಡ', code: 'KN' },
    { name: 'தமிழ்', code: 'TA' },
    { name: 'മലയാളം', code: 'ML' },
  ]

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="/" className="logo">
          <div className="logo-mark">BIS</div>

          <div className="logo-text">
            <span>BIS</span>
            <small>SmartStandards</small>
          </div>
        </a>

        {/* Navigation */}
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/assistant">AI Assistant</a>
          <a href="/standards">Standards</a>
          <a href="/certification">Certification</a>
          <a href="/laboratories">Laboratories</a>
          <a href="/multilingual">Multilingual</a>
        </div>

        {/* Actions */}
        <div className="nav-actions">

          {/* Language Dropdown */}
          <div className="language-dropdown">

            <button
              className="language-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedLanguage}
              <span>{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
              <div className="language-menu">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={
                      selectedLanguage === language.code
                        ? 'language-option active'
                        : 'language-option'
                    }
                    onClick={() => handleLanguageChange(language)}
                  >
                    <span>{language.name}</span>
                    <small>{language.code}</small>
                  </button>
                ))}
              </div>
            )}

          </div>

          <button
            className="login-button"
            onClick={() => {
              window.location.href = '/login'
            }}
          >
            Login
          </button>

          <button
            className="nav-cta"
            onClick={() => {
              window.location.href = '/assistant'
            }}
          >
            Get Started →
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar