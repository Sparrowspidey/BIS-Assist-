import React from 'react';
import FeatureCard from './FeatureCard';
import {
  Compass,
  FileCheck,
  FlaskConical,
  Award,
  ShieldCheck,
  Languages
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Compass size={24} />,
      title: 'AI Standards Discovery',
      description:
        'Describe your product in natural language and discover relevant Indian Standards, clauses, and quality parameters.',
      route: '/chat/standards',
      accent: 'blue'
    },
    {
      icon: <FileCheck size={24} />,
      title: 'Certification Guidance',
      description:
        'Understand BIS certification requirements, schemes (Scheme I & II), documentation, and factory audit steps.',
      route: '/chat/certification',
      accent: 'indigo'
    },
    {
      icon: <FlaskConical size={24} />,
      title: 'Laboratory Finder',
      description:
        'Find accredited testing laboratories across India and understand mandatory sample testing requirements.',
      route: '/chat/laboratory',
      accent: 'emerald'
    },
    {
      icon: <Award size={24} />,
      title: 'Hallmarking Guidance',
      description:
        'Get clear guidance on precious metals purity, 916 gold standards, jeweller rules, and 6-digit HUID verification.',
      route: '/chat/hallmarking',
      accent: 'amber'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Consumer Support',
      description:
        'Verify genuine ISI marks, look up CML licence status, lodge grievance complaints, and protect your safety rights.',
      route: '/chat/consumer',
      accent: 'rose'
    },
    {
      icon: <Languages size={24} />,
      title: 'Multilingual Assistance',
      description:
        'Interact with BIS Assist naturally across 10+ scheduled Indian languages with speech and dialect intelligence.',
      route: '/chat/multilingual',
      accent: 'sky'
    }
  ];

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
          From discovering standards to understanding certification and testing,
          BIS Assist brings India's entire quality ecosystem into a unified,
          source-backed AI workspace.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            route={feature.route}
            accent={feature.accent}
          />
        ))}
      </div>
    </section>
  );
}