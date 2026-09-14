function FeatureCard({ icon, title, description, path }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <a
        href={path}
        className="feature-link"
      >
        Explore →
      </a>

    </div>
  )
}

export default FeatureCard