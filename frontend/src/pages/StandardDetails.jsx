import { useState } from 'react'
import Navbar from '../components/Navbar'
import './StandardDetails.css'

function StandardDetails() {
  const [activeTab, setActiveTab] = useState('overview')

  const standard = {
    id: 'IS 302',
    year: '2024',
    title: 'Safety of Household and Similar Electrical Appliances',
    category: 'Electrical',
    status: 'ACTIVE',
    description:
      'This standard specifies general safety requirements for household and similar electrical appliances intended for use in domestic and similar environments.',
    scope:
      'This standard applies to electrical appliances used in households and similar locations. It covers requirements intended to protect users from electrical, mechanical, thermal and other potential hazards.',
  }

  return (
    <>
      <Navbar />

      <main className="standard-details-page">

        {/* Breadcrumb */}
        <div className="details-container">
          <button
            className="back-button"
            onClick={() => {
              window.location.href = '/standards'
            }}
          >
            ← Back to Standards
          </button>
        </div>

        {/* Header */}
        <section className="standard-details-header">
          <div className="details-container">

            <div className="standard-header-top">
              <div>
                <span className="details-label">
                  INDIAN STANDARD
                </span>

                <div className="standard-id-row">
                  <h1>{standard.id}</h1>

                  <span className="year-badge">
                    : {standard.year}
                  </span>

                  <span className="active-badge">
                    ✓ {standard.status}
                  </span>
                </div>
              </div>
            </div>

            <h2>{standard.title}</h2>

            <div className="details-meta">
              <span>{standard.category}</span>
              <span>•</span>
              <span>Bureau of Indian Standards</span>
            </div>

          </div>
        </section>

        {/* Main Content */}
        <section className="details-main">
          <div className="details-container">

            <div className="details-layout">

              {/* Left */}
              <div className="details-content">

                {/* Tabs */}
                <div className="details-tabs">

                  <button
                    className={
                      activeTab === 'overview'
                        ? 'details-tab active'
                        : 'details-tab'
                    }
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>

                  <button
                    className={
                      activeTab === 'scope'
                        ? 'details-tab active'
                        : 'details-tab'
                    }
                    onClick={() => setActiveTab('scope')}
                  >
                    Scope
                  </button>

                  <button
                    className={
                      activeTab === 'requirements'
                        ? 'details-tab active'
                        : 'details-tab'
                    }
                    onClick={() => setActiveTab('requirements')}
                  >
                    Requirements
                  </button>

                  <button
                    className={
                      activeTab === 'clauses'
                        ? 'details-tab active'
                        : 'details-tab'
                    }
                    onClick={() => setActiveTab('clauses')}
                  >
                    Clauses
                  </button>

                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                  <div className="details-section">

                    <span className="section-label">
                      OVERVIEW
                    </span>

                    <h3>
                      About this Standard
                    </h3>

                    <p>
                      {standard.description}
                    </p>

                    <p>
                      The standard provides a structured framework
                      for understanding safety requirements and
                      conformity expectations for applicable
                      electrical appliances.
                    </p>

                  </div>
                )}

                {/* Scope */}
                {activeTab === 'scope' && (
                  <div className="details-section">

                    <span className="section-label">
                      SCOPE
                    </span>

                    <h3>
                      Scope of the Standard
                    </h3>

                    <p>
                      {standard.scope}
                    </p>

                    <div className="info-box">
                      <span>ℹ️</span>

                      <div>
                        <strong>
                          Important
                        </strong>

                        <p>
                          Always refer to the latest authorized
                          BIS publication before making compliance
                          decisions.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* Requirements */}
                {activeTab === 'requirements' && (
                  <div className="details-section">

                    <span className="section-label">
                      REQUIREMENTS
                    </span>

                    <h3>
                      Key Requirements
                    </h3>

                    <div className="requirement-list">

                      <div className="requirement-item">
                        <span>01</span>

                        <div>
                          <strong>
                            Safety Requirements
                          </strong>

                          <p>
                            Applicable safety requirements for
                            the product and its intended use.
                          </p>
                        </div>
                      </div>

                      <div className="requirement-item">
                        <span>02</span>

                        <div>
                          <strong>
                            Testing Requirements
                          </strong>

                          <p>
                            Products may need to undergo relevant
                            conformity and testing procedures.
                          </p>
                        </div>
                      </div>

                      <div className="requirement-item">
                        <span>03</span>

                        <div>
                          <strong>
                            Compliance Requirements
                          </strong>

                          <p>
                            Manufacturers should meet the
                            applicable provisions of the standard.
                          </p>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* Clauses */}
                {activeTab === 'clauses' && (
                  <div className="details-section">

                    <span className="section-label">
                      STANDARD STRUCTURE
                    </span>

                    <h3>
                      Important Clauses
                    </h3>

                    <div className="clause-list">

                      <div className="clause-item">
                        <strong>Clause 1</strong>
                        <span>Scope</span>
                      </div>

                      <div className="clause-item">
                        <strong>Clause 2</strong>
                        <span>References</span>
                      </div>

                      <div className="clause-item">
                        <strong>Clause 3</strong>
                        <span>Definitions</span>
                      </div>

                      <div className="clause-item">
                        <strong>Clause 4</strong>
                        <span>General Requirements</span>
                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* Right Sidebar */}
              <aside className="details-sidebar">

                <div className="source-card">

                  <div className="source-icon">
                    📄
                  </div>

                  <span className="section-label">
                    SOURCE
                  </span>

                  <h3>
                    BIS Standard Document
                  </h3>

                  <p>
                    Access the authorized source document
                    and verify the applicable requirements.
                  </p>

                  <button className="source-button">
                    View Source →
                  </button>

                </div>

                <div className="ai-help-card">

                  <div className="ai-help-icon">
                    ✨
                  </div>

                  <h3>
                    Need help understanding this standard?
                  </h3>

                  <p>
                    Ask BIS AI to explain requirements,
                    clauses or certification guidance.
                  </p>

                  <button
                    onClick={() => {
                      window.location.href = '/assistant'
                    }}
                  >
                    Ask BIS AI →
                  </button>

                </div>

              </aside>

            </div>

          </div>
        </section>

      </main>
    </>
  )
}

export default StandardDetails