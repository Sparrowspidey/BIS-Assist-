import FeatureCard from './FeatureCard'

function Features() {
  const features = [
    {
      icon: '🔎',
      title: 'AI Standards Discovery',
      description:
        'Describe your product in natural language and discover relevant Indian Standards.',
      path: '/standards'
    },
    {
      icon: '📋',
      title: 'Certification Guidance',
      description:
        'Understand BIS certification requirements, schemes, licensing and compliance steps.',
      path: '/certification'
    },
    {
      icon: '🧪',
      title: 'Laboratory Finder',
      description:
        'Find relevant testing laboratories and understand testing requirements.',
      path: '/laboratories'
    },
    {
      icon: '💎',
      title: 'Hallmarking Guidance',
      description:
        'Get clear guidance about hallmarking, purity standards and related BIS services.',
      path: '/hallmarking'
    },
    {
      icon: '🛡️',
      title: 'Consumer Support',
      description:
        'Ask questions about BIS services, standards, complaints and consumer protection.',
      path: '/assistant'
    },
    {
      icon: '🌐',
      title: 'Multilingual Assistance',
      description:
        'Interact with the BIS assistant using natural language across multiple Indian languages.',
      path: '/multilingual'
    }
  ]

  return (
    <section className="features-section">

      <div className="features-header">
        <span className="section-label">
          EXPLORE BIS SERVICES
        </span>

        <h2>
          Everything you need to
          <span> navigate BIS</span>
        </h2>

        <p>
          Explore standards, certification, laboratories and
          AI-powered assistance through one intelligent platform.
        </p>
      </div>

      <div className="features-grid">

        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            path={feature.path}
          />
        ))}

      </div>

    </section>
  )
}

export default Features