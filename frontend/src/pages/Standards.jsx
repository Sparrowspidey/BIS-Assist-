import { useState } from 'react'
import Navbar from '../components/Navbar'
import './Standards.css'

function Standards() {

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const standards = [
    {
      id: 'IS 302',
      year: '2024',
      title: 'Safety of Household and Similar Electrical Appliances',
      category: 'Electrical',
      description:
        'Requirements relating to the safety of household and similar electrical appliances.',
    },
    {
      id: 'IS 10386',
      year: '2022',
      title: 'Stainless Steel Utensils',
      category: 'Consumer Products',
      description:
        'Requirements and specifications for stainless steel utensils used by consumers.',
    },
    {
      id: 'IS 10500',
      year: '2012',
      title: 'Drinking Water — Specification',
      category: 'Food',
      description:
        'Specification for acceptable quality requirements of drinking water.',
    },
    {
      id: 'IS 456',
      year: '2000',
      title: 'Plain and Reinforced Concrete',
      category: 'Construction',
      description:
        'Code of practice for general structural use of plain and reinforced concrete.',
    },
    {
      id: 'IS 16014',
      year: '2018',
      title: 'Smart Manufacturing Systems',
      category: 'Engineering',
      description:
        'Guidelines and requirements related to smart manufacturing systems.',
    },
    {
      id: 'IS 13252',
      year: '2010',
      title: 'Information Technology Equipment',
      category: 'Electronics',
      description:
        'Safety requirements for information technology and related equipment.',
    },
  ]

  const categories = [
    'All',
    'Engineering',
    'Food',
    'Electronics',
    'Construction',
    'Consumer Products',
  ]

 const filteredStandards = standards
  .filter((standard) => {
    const matchesSearch =
      standard.id.toLowerCase().includes(search.toLowerCase()) ||
      standard.title.toLowerCase().includes(search.toLowerCase()) ||
      standard.description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' ||
      standard.category === category

    return matchesSearch && matchesCategory
  })
  .sort((a, b) => {
    if (sortBy === 'newest') {
      return Number(b.year) - Number(a.year)
    }

    if (sortBy === 'oldest') {
      return Number(a.year) - Number(b.year)
    }

    if (sortBy === 'name') {
      return a.title.localeCompare(b.title)
    }

    return 0
  })

  return (
    <>
      <Navbar />

      <main className="standards-page">

        {/* Hero */}

        <section className="standards-hero">

          <div className="standards-hero-content">

            <span className="standards-label">
              BIS STANDARDS LIBRARY
            </span>

            <h1>
              Indian Standards
              <span> Explorer</span>
            </h1>

            <p>
              Search, explore and understand Indian Standards
              from the BIS standards ecosystem.
            </p>

          </div>


          {/* Search */}

          <div className="standards-search">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by IS number, title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}

          </div>

        </section>


        {/* Content */}

        <section className="standards-content">

          {/* Categories */}

          <div className="category-row">

            {categories.map((item) => (

              <button
                key={item}
                className={
                  category === item
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>

            ))}

          </div>


          {/* Header */}

          <div className="standards-header">

            <div>
              <span className="results-label">
                STANDARDS LIBRARY
              </span>

              <h2>
                {filteredStandards.length} Standards
              </h2>
            </div>

            
  <select
    className="sort-select"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="newest">
      Newest
    </option>

    <option value="oldest">
      Oldest
    </option>

    <option value="name">
      Name A–Z
    </option>
  </select>

  <div className="total-standards">
    10,000+ Standards
  </div>

</div>

          


          {/* Cards */}

          <div className="standards-grid">

            {filteredStandards.length > 0 ? (

              filteredStandards.map((standard) => (

                <article
                  className="standard-card"
                  key={standard.id}
                >

                  <div className="standard-card-top">

                    <span className="standard-number">
                      {standard.id} : {standard.year}
                    </span>

                    <span className="status-badge">
                      ✓ ACTIVE
                    </span>

                  </div>


                  <h3>
                    {standard.title}
                  </h3>


                  <span className="standard-category">
                    {standard.category}
                  </span>


                  <p>
                    {standard.description}
                  </p>


                  <button
                       className="view-standard"
                       onClick={() =>
                       window.location.href = `/standards/${standard.id.replace(' ', '-')}`
                        }
                    >  
                    View Standard
                    <span>→</span>
                  </button>

                </article>

              ))

            ) : (

              <div className="no-results">

                <div>
                  🔍
                </div>

                <h3>
                  No standards found
                </h3>

                <p>
                  Try searching with another IS number,
                  title or keyword.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>
    </>
  )
}

export default Standards