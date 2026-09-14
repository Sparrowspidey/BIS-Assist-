import Navbar from '../components/Navbar'
import './Laboratories.css'

function Laboratories() {
  const laboratories = [
    {
      name: 'BIS Central Laboratory',
      location: 'Ghaziabad, Uttar Pradesh',
      type: 'BIS Laboratory',
      services: 'Product testing & conformity assessment',
    },
    {
      name: 'BIS Laboratory',
      location: 'Mumbai, Maharashtra',
      type: 'BIS Laboratory',
      services: 'Testing and quality evaluation',
    },
    {
      name: 'BIS Laboratory',
      location: 'Kolkata, West Bengal',
      type: 'BIS Laboratory',
      services: 'Product testing services',
    },
  ]

  return (
    <>
      <Navbar />

      <main className="laboratories-page">

        {/* HERO */}

        <section className="laboratories-hero">

          <div className="laboratories-hero-content">

            <span className="laboratories-label">
              BIS LABORATORY SERVICES
            </span>

            <h1>
              Find the right
              <span> laboratory</span>
            </h1>

            <p>
              Explore laboratory information and understand
              testing requirements related to BIS standards
              and conformity assessment.
            </p>

            <div className="laboratory-search">

              <span>🔎</span>

              <input
                type="text"
                placeholder="Search by product, test or location..."
              />

              <button>
                Search →
              </button>

            </div>

            <div className="laboratory-note">
              ✓ Laboratory information should be verified against
              current BIS sources before use.
            </div>

          </div>

        </section>


        {/* MAIN */}

        <section className="laboratories-main">

          <div className="laboratories-container">

            {/* OVERVIEW */}

            <div className="laboratories-overview">

              <div>

                <span className="section-label">
                  LABORATORY FINDER
                </span>

                <h2>
                  Testing support for your product
                </h2>

              </div>

              <p>
                Identify relevant testing facilities and understand
                what laboratory services may be required for your
                product and applicable standard.
              </p>

            </div>


            {/* FILTERS */}

            <div className="laboratory-filters">

              <button className="laboratory-filter active">
                All Laboratories
              </button>

              <button className="laboratory-filter">
                BIS Laboratories
              </button>

              <button className="laboratory-filter">
                Recognized Laboratories
              </button>

              <button className="laboratory-filter">
                Product Testing
              </button>

            </div>


            {/* LAB CARDS */}

            <div className="laboratories-grid">

              {laboratories.map((lab, index) => (

                <article
                  className="laboratory-card"
                  key={index}
                >

                  <div className="laboratory-card-top">

                    <div className="laboratory-icon">
                      🧪
                    </div>

                    <span className="laboratory-status">
                      AVAILABLE
                    </span>

                  </div>

                  <span className="laboratory-type">
                    {lab.type}
                  </span>

                  <h3>
                    {lab.name}
                  </h3>

                  <div className="laboratory-location">
                    📍 {lab.location}
                  </div>

                  <p>
                    {lab.services}
                  </p>

                  <button className="laboratory-details-button">
                    View Details →
                  </button>

                </article>

              ))}

            </div>


            {/* AI GUIDANCE */}

            <section className="laboratory-ai-card">

              <div className="laboratory-ai-icon">
                ✨
              </div>

              <div className="laboratory-ai-content">

                <span>
                  BIS AI ASSISTANT
                </span>

                <h2>
                  Not sure what testing you need?
                </h2>

                <p>
                  Describe your product and BIS Assist can help
                  you understand the applicable standard, possible
                  testing requirements and the next step.
                </p>

              </div>

              <button
                onClick={() => {
                  window.location.href = '/assistant'
                }}
              >
                Ask BIS AI →
              </button>

            </section>

          </div>

        </section>

      </main>
    </>
  )
}

export default Laboratories