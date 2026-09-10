function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <div className="logo">
          <div className="logo-mark">
            BIS
          </div>

          <div className="logo-text">
            <span>BIS</span>
            <small>SmartStandards</small>
          </div>
        </div>


        {/* Navigation links */}
        <div className="nav-links">

          <a href="#assistant">
            AI Assistant
          </a>

          <a href="#standards">
            Standards
          </a>

          <a href="#certification">
            Certification
          </a>

          <a href="#laboratories">
            Laboratories
          </a>

        </div>


        {/* Right side */}
        <div className="nav-actions">

          <button className="language-button">
            EN ▾
          </button>

          <button className="login-button">
            Login
          </button>

          <button className="nav-cta">
            Get Started
          </button>

        </div>

      </div>

    </nav>
  )
}

export default Navbar