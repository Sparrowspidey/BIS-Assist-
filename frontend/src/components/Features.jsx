import FeatureCard from './FeatureCard'

function Features() {

  const features = [
    {
      icon: '🔎',
      title: 'AI Standards Discovery',
      description:
        'Describe your product in natural language and discover relevant Indian Standards.'
    },
    {
      icon: '📋',
      title: 'Certification Guidance',
      description:
        'Understand BIS certification requirements, schemes, licensing and compliance steps.'
    },
    {
      icon: '🧪',
      title: 'Laboratory Finder',
      description:
        'Find relevant testing laboratories and understand testing requirements.'
    },
    {
      icon: '💎',
      title: 'Hallmarking Guidance',
      description:
        'Get clear guidance about hallmarking, purity standards and related BIS services.'
    },
    {
      icon: '🛡️',
      title: 'Consumer Support',
      description:
        'Ask questions about BIS services, standards, complaints and consumer protection.'
    },
    {
      icon: '🌐',
      title: 'Multilingual Assistance',
      description:
        'Interact with the BIS assistant using natural language across multiple Indian languages.'
    }
  ]

  return (
    <section className="features-section" id="standards">

      <div className="section-heading">

        <span className="section-label">
          ONE INTELLIGENT PLATFORM
        </span>

        <h2>
          Everything you need to navigate
          <span> BIS services</span>
        </h2>

        <p>
          From discovering standards to understanding certification,
          BIS Assist brings the entire standards ecosystem into one
          intelligent interface.
        </p>

      </div>

      <div className="features-grid">

        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}

      </div>

    </section>
  )
}

export default Features