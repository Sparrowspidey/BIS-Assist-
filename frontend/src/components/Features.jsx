<<<<<<< HEAD
import FeatureCard from './FeatureCard'

function Features() {
=======
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
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
  const features = [
    {
      icon: <Compass size={24} />,
      title: 'AI Standards Discovery',
      description:
<<<<<<< HEAD
        'Describe your product in natural language and discover relevant Indian Standards.',
      path: '/standards'
=======
        'Describe your product in natural language and discover relevant Indian Standards, clauses, and quality parameters.',
      route: '/chat/standards',
      accent: 'blue'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    },
    {
      icon: <FileCheck size={24} />,
      title: 'Certification Guidance',
      description:
<<<<<<< HEAD
        'Understand BIS certification requirements, schemes, licensing and compliance steps.',
      path: '/certification'
=======
        'Understand BIS certification requirements, schemes (Scheme I & II), documentation, and factory audit steps.',
      route: '/chat/certification',
      accent: 'indigo'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    },
    {
      icon: <FlaskConical size={24} />,
      title: 'Laboratory Finder',
      description:
<<<<<<< HEAD
        'Find relevant testing laboratories and understand testing requirements.',
      path: '/laboratories'
=======
        'Find accredited testing laboratories across India and understand mandatory sample testing requirements.',
      route: '/chat/laboratory',
      accent: 'emerald'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    },
    {
      icon: <Award size={24} />,
      title: 'Hallmarking Guidance',
      description:
<<<<<<< HEAD
        'Get clear guidance about hallmarking, purity standards and related BIS services.',
      path: '/hallmarking'
=======
        'Get clear guidance on precious metals purity, 916 gold standards, jeweller rules, and 6-digit HUID verification.',
      route: '/chat/hallmarking',
      accent: 'amber'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Consumer Support',
      description:
<<<<<<< HEAD
        'Ask questions about BIS services, standards, complaints and consumer protection.',
      path: '/assistant'
=======
        'Verify genuine ISI marks, look up CML licence status, lodge grievance complaints, and protect your safety rights.',
      route: '/chat/consumer',
      accent: 'rose'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    },
    {
      icon: <Languages size={24} />,
      title: 'Multilingual Assistance',
      description:
<<<<<<< HEAD
        'Interact with the BIS assistant using natural language across multiple Indian languages.',
      path: '/multilingual'
=======
        'Interact with BIS Assist naturally across 10+ scheduled Indian languages with speech and dialect intelligence.',
      route: '/chat/multilingual',
      accent: 'sky'
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
    }
  ];

  return (
<<<<<<< HEAD
    <section className="features-section">

      <div className="features-header">
=======
    <section className="features-section" id="standards">
      <div className="section-heading">
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
        <span className="section-label">
          EXPLORE BIS SERVICES
        </span>

        <h2>
          Everything you need to
          <span> navigate BIS</span>
        </h2>

        <p>
<<<<<<< HEAD
          Explore standards, certification, laboratories and
          AI-powered assistance through one intelligent platform.
=======
          From discovering standards to understanding certification and testing,
          BIS Assist brings India's entire quality ecosystem into a unified,
          source-backed AI workspace.
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
        </p>
      </div>

      <div className="features-grid">
<<<<<<< HEAD

        {features.map((feature) => (
=======
        {features.map((feature, index) => (
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
<<<<<<< HEAD
            path={feature.path}
=======
            route={feature.route}
            accent={feature.accent}
>>>>>>> 2e2339a246f2031323bf4e32669b13106c00f754
          />
        ))}
      </div>
    </section>
  );
}