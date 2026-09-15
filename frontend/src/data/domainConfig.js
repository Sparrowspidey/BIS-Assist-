export const DOMAINS = {
  standards: {
    id: 'standards',
    path: '/chat/standards',
    label: 'AI STANDARDS DISCOVERY',
    title: 'Standards Assistant',
    badge: 'DISCOVERY',
    themeColor: '#0f4c81',
    orbTheme: 'standards',
    tagline: 'Discover and interpret Indian Standards with semantic AI',
    welcome: {
      label: 'BIS AI ASSISTANT',
      heading: 'Find the right BIS Standard',
      description: 'Describe your product in natural language and I\'ll help you discover the relevant Indian Standards, clauses, and quality benchmarks.'
    },
    suggestions: [
      {
        icon: 'Search',
        title: 'Find a standard for my product',
        desc: 'Describe specs or use-case',
        query: 'Which BIS standard applies to stainless steel water bottles and insulated flasks?'
      },
      {
        icon: 'Hash',
        title: 'Search by IS number',
        desc: 'Direct lookup & clause interpretation',
        query: 'Explain the scope and mandatory requirements of IS 17803:2022'
      },
      {
        icon: 'BookOpen',
        title: 'Explain a BIS standard',
        desc: 'Translate legal/technical clauses',
        query: 'What are the permissible limits for heavy metals in drinking water under IS 10500:2012?'
      },
      {
        icon: 'GitCompare',
        title: 'Compare standards',
        desc: 'Contrast differences and overlaps',
        query: 'What is the exact difference between IS 10500 (Drinking Water) and IS 14543 (Packaged Water)?'
      }
    ],
    contextPanel: {
      type: 'standards',
      heading: 'Relevant Standards',
      subheading: 'Identified from current inquiry',
      badge: 'OFFICIAL BIS CATALOGUE',
      standards: [
        {
          code: 'IS 17803 : 2022',
          title: 'Stainless Steel Water Bottles & Flasks',
          relevance: 96,
          status: 'Active · Mandatory QCO',
          clause: 'Clause 4.2 · Page 18',
          docId: 'DOC-BIS-2022-17803'
        },
        {
          code: 'IS 10500 : 2012',
          title: 'Drinking Water Specification',
          relevance: 88,
          status: 'Active · Standard',
          clause: 'Clause 3.1 · Table 1',
          docId: 'DOC-BIS-2012-10500'
        },
        {
          code: 'IS 6911 : 2017',
          title: 'Stainless Steel Plate, Sheet and Strip',
          relevance: 82,
          status: 'Active · Material Grade',
          clause: 'Grade AISI 304 / 316',
          docId: 'DOC-BIS-2017-6911'
        }
      ],
      quickActions: [
        { label: 'Browse BIS Standards Portal', url: 'https://www.standardsbis.in' },
        { label: 'Check Quality Control Orders (QCOs)', url: '#' },
        { label: 'Download Standards Catalogue Index', url: '#' }
      ]
    },
    defaultResponses: {
      'Which BIS standard applies to stainless steel water bottles and insulated flasks?': {
        title: 'Applicable Standard Identified: IS 17803:2022',
        summary: 'For stainless steel water bottles, flasks, and insulated containers, the Bureau of Indian Standards mandates **IS 17803:2022** (Stainless Steel Vacuum Flasks / Bottles for Domestic Use).',
        bulletPoints: [
          '**Material Requirement**: The body and food-contact parts must be manufactured from food-grade Austenitic Stainless Steel conforming to IS 6911 (Grade 304 or 316).',
          '**Thermal Performance**: Double-walled vacuum containers must maintain temperature limits (minimum 60°C after 6 hours for hot liquids).',
          '**Leakage & Drop Test**: Must withstand a drop test from 1.2 meters without structural rupture or loss of vacuum sealing.',
          '**Mandatory QCO**: Under the Ministry of Consumer Affairs notification, this standard is covered under a mandatory Quality Control Order (QCO).'
        ],
        highlight: {
          code: 'IS 17803 : 2022',
          name: 'Stainless Steel Vacuum Flasks & Bottles',
          matchScore: '96% Match'
        },
        sources: [
          { code: 'IS 17803 : 2022', clause: 'Clause 4.2 (Material & Workmanship)', page: 'Page 18' },
          { code: 'IS 6911 : 2017', clause: 'Table 2 (Austenitic Grades Composition)', page: 'Page 9' }
        ]
      },
      fallback: {
        title: 'Standards Intelligence Analysis',
        summary: 'Based on semantic retrieval from the BIS Standards Catalogue, here is the relevant standard specification and clause guidance for your query:',
        bulletPoints: [
          '**Primary Standard Specification**: The product is governed under the relevant Indian Standard published under the Bureau of Indian Standards Act, 2016.',
          '**Conformity Assessment**: Manufacturers must verify both raw material specifications and finished-product performance testing.',
          '**Marking Requirements**: The product or its primary packaging must bear the Standard Mark (ISI mark) along with the unique Licence Number (CM/L).',
          '**Regulatory Mandate**: Verify whether this standard is governed by an active Quality Control Order (QCO) before commercial release.'
        ],
        highlight: {
          code: 'IS 17803 : 2022',
          name: 'Indian Standard Product Specification',
          matchScore: '94% Match'
        },
        sources: [
          { code: 'IS 17803 : 2022', clause: 'Clause 4.2 · Requirements', page: 'Page 18' },
          { code: 'BIS Act 2016', clause: 'Section 16 · Conformity Assessment', page: 'Gazette' }
        ]
      }
    }
  },

  certification: {
    id: 'certification',
    path: '/chat/certification',
    label: 'CERTIFICATION GUIDANCE',
    title: 'Certification Guide',
    badge: 'COMPLIANCE',
    themeColor: '#4f46e5',
    orbTheme: 'certification',
    tagline: 'Understand BIS schemes, licensing prerequisites, and application workflows',
    welcome: {
      label: 'BIS CERTIFICATION ASSISTANT',
      heading: 'Let\'s get your product certified',
      description: 'I\'ll help you understand BIS certification requirements, schemes, documentation, factory audits, and compliance steps.'
    },
    suggestions: [
      {
        icon: 'HelpCircle',
        title: 'How do I get BIS certification?',
        desc: 'Comprehensive step-by-step roadmap',
        query: 'What is the end-to-end process to obtain a BIS ISI mark license for manufacturing?'
      },
      {
        icon: 'Layers',
        title: 'Which certification scheme applies?',
        desc: 'Scheme I (ISI) vs Scheme II (CRS)',
        query: 'What is the difference between BIS Scheme-I (ISI Mark) and Scheme-II (Compulsory Registration Scheme)?'
      },
      {
        icon: 'FileText',
        title: 'What documents do I need?',
        desc: 'Factory, machinery & lab checklist',
        query: 'What documents and test equipment are required for a BIS factory audit under Scheme-I?'
      },
      {
        icon: 'Clock',
        title: 'Explain the certification process',
        desc: 'Timelines, inspections, and sample testing',
        query: 'What are the typical timelines and audit procedures for grant of BIS license?'
      }
    ],
    contextPanel: {
      type: 'certification',
      heading: 'Certification Journey',
      subheading: 'Progress Roadmap for BIS License',
      badge: 'SCHEME-I / CRS',
      steps: [
        { num: 1, title: 'Product Identification', desc: 'Confirm IS standard & QCO mandate', status: 'completed' },
        { num: 2, title: 'In-house Lab Setup', desc: 'Install mandatory testing equipment', status: 'current' },
        { num: 3, title: 'Portal Application', desc: 'Submit Form-V on Manakonline', status: 'upcoming' },
        { num: 4, title: 'Factory Inspection', desc: 'BIS Auditor on-site verification', status: 'upcoming' },
        { num: 5, title: 'Grant of Licence', desc: 'Allotment of CM/L licence number', status: 'upcoming' }
      ],
      quickActions: [
        { label: 'Access Manakonline Portal', url: 'https://www.manakonline.in' },
        { label: 'Check Scheme-I Guidelines', url: '#' },
        { label: 'Download Fee Schedule & Tariffs', url: '#' }
      ]
    },
    defaultResponses: {
      'What is the end-to-end process to obtain a BIS ISI mark license for manufacturing?': {
        title: 'BIS Scheme-I (ISI Mark) Certification Workflow',
        summary: 'To obtain a BIS licence under Product Certification Scheme-I (ISI Mark), domestic manufacturers must complete a structured 5-phase procedure:',
        bulletPoints: [
          '**Phase 1 - Conformity & Facility**: Ensure manufacturing machinery and in-house testing apparatus comply with the relevant Scheme of Testing and Inspection (STI).',
          '**Phase 2 - Online Filing**: Register on Manakonline portal and submit Form-V along with factory layout, calibration certificates, and raw material test reports.',
          '**Phase 3 - Preliminary Audit**: A BIS inspecting officer conducts an unannounced physical verification of your manufacturing facility, QC laboratory, and processes.',
          '**Phase 4 - Independent Lab Testing**: The officer draws independent production samples and sends them to a recognized BIS laboratory for conformity verification.',
          '**Phase 5 - Grant of Licence (CM/L)**: Upon satisfactory test results and audit report, BIS issues the Certificate of Manufacture Licence (CM/L).'
        ],
        highlight: {
          code: 'BIS Scheme-I',
          name: 'Product Conformity Certification (ISI Mark)',
          matchScore: 'Standard Process'
        },
        sources: [
          { code: 'BIS (Conformity Assessment) Reg.', clause: 'Regulation 7 · Grant of Licence', page: 'Gazette 2018' },
          { code: 'Scheme-I Manual', clause: 'STI Guidelines · Section 3', page: 'Page 12' }
        ]
      },
      fallback: {
        title: 'BIS Certification Intelligence Summary',
        summary: 'The Bureau of Indian Standards operates multiple conformity assessment schemes tailored to domestic manufacturing, imports, and electronics:',
        bulletPoints: [
          '**Scheme I (ISI Mark)**: Requires in-house factory testing setup, physical factory audit, and drawing of samples for testing at recognized laboratories.',
          '**Scheme II (CRS - Compulsory Registration)**: Primarily for electronic goods; grant based on third-party BIS-recognized lab test reports without mandatory pre-grant factory audit.',
          '**Foreign Manufacturers Certification Scheme (FMCS)**: For overseas manufacturers producing goods destined for the Indian market.',
          '**Statutory Compliance**: Failure to certify products listed under mandatory Quality Control Orders attracts penal provisions under Section 29 of the BIS Act, 2016.'
        ],
        highlight: {
          code: 'Scheme-I / Scheme-II',
          name: 'BIS Conformity Assessment Framework',
          matchScore: 'Guidance'
        },
        sources: [
          { code: 'BIS Act 2016', clause: 'Section 13, 14 & 15', page: 'Statutory Act' },
          { code: 'Manakonline Guide', clause: 'e-BIS User Manual', page: 'Section 4' }
        ]
      }
    }
  },

  laboratory: {
    id: 'laboratory',
    path: '/chat/laboratory',
    label: 'LABORATORY FINDER',
    title: 'Laboratory Finder',
    badge: 'TESTING',
    themeColor: '#059669',
    orbTheme: 'laboratory',
    tagline: 'Locate NABL accredited and BIS-recognized testing facilities across India',
    welcome: {
      label: 'BIS LABORATORY ASSISTANT',
      heading: 'Find the right testing laboratory',
      description: 'Tell me about your product and I\'ll help you understand testing parameters, sample requirements, and find accredited laboratories.'
    },
    suggestions: [
      {
        icon: 'MapPin',
        title: 'Find a BIS-recognized laboratory',
        desc: 'Search by product or IS standard',
        query: 'Find BIS-recognized and NABL accredited laboratories for testing electronic components'
      },
      {
        icon: 'TestTube',
        title: 'What testing does my product need?',
        desc: 'Chemical, physical, and safety tests',
        query: 'What specific test parameters are mandatory for packaged natural mineral water?'
      },
      {
        icon: 'Navigation',
        title: 'Find labs near me',
        desc: 'Locate regional testing centers',
        query: 'Show me BIS accredited testing laboratories in Western Region (Maharashtra and Gujarat)'
      },
      {
        icon: 'FileCheck',
        title: 'Explain testing requirements',
        desc: 'Sample quantities and turnaround time',
        query: 'What are the sample preparation requirements and testing turnaround times for electrical appliances?'
      }
    ],
    contextPanel: {
      type: 'laboratory',
      heading: 'Recommended Testing Labs',
      subheading: 'NABL & BIS Recognized Facilities',
      badge: 'ACCREDITED LAB NETWORK',
      labs: [
        {
          name: 'Central Laboratory BIS (CL)',
          location: 'Plot 20/9, Site IV, Sahibabad, Ghaziabad (UP)',
          scope: 'Electrical, Chemical, Mechanical, Microbiological',
          badge: 'National Central Lab',
          rating: 'Apex Facility'
        },
        {
          name: 'Western Regional Office Laboratory (WROL)',
          location: 'Andheri (East), Mumbai, Maharashtra',
          scope: 'Metals, Textiles, Food Products, Polymers',
          badge: 'Regional Lab',
          rating: 'BIS Owned'
        },
        {
          name: 'Southern Regional Office Laboratory (SROL)',
          location: 'CIT Campus, Taramani, Chennai, Tamil Nadu',
          scope: 'Civil Engineering, Electronic Components, Cables',
          badge: 'Regional Lab',
          rating: 'BIS Owned'
        },
        {
          name: 'Eastern Regional Office Laboratory (EROL)',
          location: 'Salt Lake City, Kolkata, West Bengal',
          scope: 'Chemical, Metallurgy, Food, Leather',
          badge: 'Regional Lab',
          rating: 'BIS Owned'
        }
      ],
      quickActions: [
        { label: 'Search LIMS Portal Directory', url: 'https://www.lims.bis.gov.in' },
        { label: 'Download Test Request Form (TRF)', url: '#' },
        { label: 'View NABL Scope Directory', url: '#' }
      ]
    },
    defaultResponses: {
      'Find BIS-recognized and NABL accredited laboratories for testing electronic components': {
        title: 'Accredited Laboratories for Electronics Testing',
        summary: 'Testing of electronics and IT hardware under BIS Compulsory Registration Scheme (CRS) must be conducted at BIS-recognized laboratories accredited as per ISO/IEC 17025.',
        bulletPoints: [
          '**Central Laboratory (CL) Sahibabad**: Comprehensive capability for electromagnetic compatibility (EMC), safety (IS 13252), and climatic environmental testing.',
          '**SAMEER (Centre for Electromagnetics)**: Specialised in EMI/EMC emissions, RF testing, and power surge immunity located in Chennai and Mumbai.',
          '**ERTL (North) & ERTL (East)**: Electronics Regional Test Laboratories operated under STQC offering certified compliance reports for BIS registration.',
          '**Turnaround Time**: Standard safety testing takes 15-20 working days depending on product category and component breakdown.'
        ],
        highlight: {
          code: 'ISO/IEC 17025',
          name: 'Testing & Calibration Laboratories Recognition',
          matchScore: 'Accredited'
        },
        sources: [
          { code: 'BIS LIMS Portal', clause: 'Recognized Lab List 2025', page: 'Directory' },
          { code: 'IS 13252 (Part 1)', clause: 'Information Technology Equipment Safety', page: 'Page 24' }
        ]
      },
      fallback: {
        title: 'Laboratory Testing Network Intelligence',
        summary: 'BIS maintains an extensive network of 8 owned laboratories and over 250+ private and government recognized testing facilities across India:',
        bulletPoints: [
          '**Laboratory Recognition Scheme (LRS)**: Private testing laboratories are audited under LRS-2020 ensuring strict compliance with ISO/IEC 17025.',
          '**Sample Dispatch**: Test samples drawn during BIS surveillance audits are barcoded and randomly dispatched through the automated LIMS portal to maintain anonymity.',
          '**Test Parameters**: Every product standard defines rigorous destructive and non-destructive testing requirements.',
          '**Testing Charges**: Testing fees are standardized as per the official BIS Laboratory Testing Fee schedule.'
        ],
        highlight: {
          code: 'LRS-2020',
          name: 'BIS Laboratory Recognition Scheme',
          matchScore: 'Network'
        },
        sources: [
          { code: 'BIS Lab Manual', clause: 'Section 4 · Sample Ingestion', page: 'Page 31' },
          { code: 'LIMS System', clause: 'Accredited Scope Validation', page: 'Online' }
        ]
      }
    }
  },

  hallmarking: {
    id: 'hallmarking',
    path: '/chat/hallmarking',
    label: 'HALLMARKING GUIDANCE',
    title: 'Hallmarking Assistant',
    badge: 'PURITY',
    themeColor: '#d97706',
    orbTheme: 'hallmarking',
    tagline: 'Verify gold and silver purity, 6-digit HUID marks, and jeweller guidelines',
    welcome: {
      label: 'BIS HALLMARKING ASSISTANT',
      heading: 'Understand BIS Hallmarking',
      description: 'Get clear guidance on hallmarking, purity, precious-metal standards, 6-digit HUID codes, and consumer verification steps.'
    },
    suggestions: [
      {
        icon: 'Award',
        title: 'What does 916 gold mean?',
        desc: 'Fineness calculation and carats',
        query: 'What does 916 purity hallmark mean on gold jewellery and how is it calculated?'
      },
      {
        icon: 'Shield',
        title: 'Explain hallmarking',
        desc: 'The 3 mandatory marks explained',
        query: 'What are the 3 mandatory marks on hallmarked gold jewellery in India?'
      },
      {
        icon: 'FileText',
        title: 'What are hallmarking requirements?',
        desc: 'Rules for jewellers and consumers',
        query: 'Is hallmarking mandatory across all districts in India for selling gold jewellery?'
      },
      {
        icon: 'Search',
        title: 'How can I verify a hallmark?',
        desc: 'HUID verification on BIS Care',
        query: 'How can I verify the 6-digit alphanumeric HUID code using the BIS Care App?'
      }
    ],
    contextPanel: {
      type: 'hallmarking',
      heading: 'Gold & Silver Purity Guide',
      subheading: 'Official Indian Standards Fineness Grades',
      badge: 'IS 1417 / IS 2112',
      purityList: [
        { carat: '24K Gold', fineness: '999', desc: '99.9% Pure Gold (Bullion/Coins)' },
        { carat: '22K Gold', fineness: '916', desc: '91.6% Pure Gold (Common Jewellery)' },
        { carat: '20K Gold', fineness: '833', desc: '83.3% Pure Gold (Ornaments)' },
        { carat: '18K Gold', fineness: '750', desc: '75.0% Pure Gold (Studded/Diamond)' },
        { carat: '14K Gold', fineness: '585', desc: '58.5% Pure Gold (Modern Designs)' }
      ],
      hallmarkComponents: [
        { mark: '1. BIS Logo', desc: 'Triangular mark certifying official BIS conformity' },
        { mark: '2. Purity & Fineness', desc: 'Carat + Fineness stamp (e.g., 22K916 or 18K750)' },
        { mark: '3. 6-Digit HUID', desc: 'Unique alphanumeric laser mark for complete traceability' }
      ],
      quickActions: [
        { label: 'Download BIS Care App for HUID Verification', url: '#' },
        { label: 'Find Assaying & Hallmarking Centres (AHC)', url: '#' },
        { label: 'Check Jeweller Registration Status', url: '#' }
      ]
    },
    defaultResponses: {
      'What does 916 purity hallmark mean on gold jewellery and how is it calculated?': {
        title: '22 Carat Gold Purity: 916 Fineness Decoded',
        summary: 'The number **916** indicates **91.6% pure gold**, commonly referred to as **22 Carat Gold** in the Indian precious metals market.',
        bulletPoints: [
          '**Fineness Calculation**: Purity is measured in parts per thousand. Out of 1000 parts, 916 parts are pure 24K gold, and the remaining 84 parts consist of alloying metals like copper or silver to provide tensile durability.',
          '**Official Standard**: Governed under **IS 1417:2016** (Gold and Gold Alloys, Platings and Ingot — Purity and Markings).',
          '**Laser Stamping**: On modern hallmarked ornaments, the stamp explicitly displays `22K916` alongside the BIS Triangle logo and the 6-digit HUID code.',
          '**Consumer Protection**: If an item hallmarked 916 tests below 91.6% purity at a BIS referral center, the consumer is entitled to compensation twice the shortfall.'
        ],
        highlight: {
          code: 'IS 1417 : 2016',
          name: '22K916 Gold Purity Grade',
          matchScore: '91.6% Pure'
        },
        sources: [
          { code: 'IS 1417 : 2016', clause: 'Clause 4 · Grades of Gold', page: 'Page 5' },
          { code: 'Hallmarking Order 2021', clause: 'Schedule I · Mandatory Marks', page: 'Gazette' }
        ]
      },
      fallback: {
        title: 'Hallmarking Standards & Traceability Intelligence',
        summary: 'BIS Hallmarking provides third-party assurance of the declared purity and fineness of gold and silver articles:',
        bulletPoints: [
          '**Mandatory 3 Marks**: Since July 2021, genuine hallmarked gold features exactly 3 elements: BIS Logo, Purity mark (e.g. 22K916), and the 6-digit HUID.',
          '**HUID (Hallmark Unique Identification)**: A unique 6-character alphanumeric code engraved by an authorized Assaying & Hallmarking Centre (AHC).',
          '**Instant Verification**: Inputting the HUID code into the BIS Care App reveals the jeweller registration, AHC center, item type, and date of hallmarking.',
          '**Exemptions**: Items below 2 grams, export jewellery, and medical/industrial gold are exempt from mandatory hallmarking.'
        ],
        highlight: {
          code: 'HUID System',
          name: '6-Digit Hallmark Unique Identification',
          matchScore: 'Traceable'
        },
        sources: [
          { code: 'Hallmarking Reg. 2018', clause: 'Section 14 · Verification', page: 'Page 9' },
          { code: 'IS 2112 : 2014', clause: 'Silver Hallmarking Standards', page: 'Page 4' }
        ]
      }
    }
  },

  consumer: {
    id: 'consumer',
    path: '/chat/consumer',
    label: 'CONSUMER SUPPORT',
    title: 'Consumer Support',
    badge: 'PROTECTION',
    themeColor: '#e11d48',
    orbTheme: 'consumer',
    tagline: 'Protect your consumer rights, verify ISI marks, and register product grievances',
    welcome: {
      label: 'BIS CONSUMER HELPDESK',
      heading: 'How can BIS help you?',
      description: 'Ask questions about BIS services, standards, filing quality complaints, verifying ISI marks, and asserting your consumer safety rights.'
    },
    suggestions: [
      {
        icon: 'CheckCircle',
        title: 'How do I verify a BIS mark?',
        desc: 'Check genuine ISI or CRS marks',
        query: 'How do I verify whether an ISI mark and CM/L license number on a helmet is genuine?'
      },
      {
        icon: 'AlertTriangle',
        title: 'How do I file a complaint?',
        desc: 'Grievance redressal process',
        query: 'What is the step-by-step procedure to lodge a complaint against substandard BIS certified products?'
      },
      {
        icon: 'Search',
        title: 'Is this product BIS certified?',
        desc: 'Check license validity status',
        query: 'How can I check if a brand\'s BIS license is currently active, suspended, or expired?'
      },
      {
        icon: 'ShieldCheck',
        title: 'What are my consumer rights?',
        desc: 'Legal protections and remedies',
        query: 'What are the legal remedies and penalties if a retailer sells fake ISI marked products?'
      }
    ],
    contextPanel: {
      type: 'consumer',
      heading: 'Consumer Protection Resources',
      subheading: 'Tools to Guarantee Product Authenticity',
      badge: 'CONSUMER EMPOWERMENT',
      resources: [
        {
          title: 'BIS Care Mobile Application',
          desc: 'Official app to verify CM/L license numbers, CRS registration numbers, and 6-digit HUID hallmarking codes instantly.',
          action: 'Download on Android / iOS'
        },
        {
          title: 'Public Grievance Redressal (CPGRAMS)',
          desc: 'Direct portal to register complaints regarding misuse of BIS marks, sub-standard products, or non-compliant jewellers.',
          action: 'Lodge Grievance →'
        },
        {
          title: 'Quality Control Orders (QCO) Repository',
          desc: 'Search all 600+ industrial and consumer goods where manufacturing and sales without ISI mark is legally prohibited.',
          action: 'Browse QCO List →'
        }
      ],
      quickActions: [
        { label: 'Verify CM/L Licence Number Online', url: 'https://www.manakonline.in' },
        { label: 'File a Consumer Quality Complaint', url: '#' },
        { label: 'Check Product Safety Guidelines', url: '#' }
      ]
    },
    defaultResponses: {
      'How do I verify whether an ISI mark and CM/L license number on a helmet is genuine?': {
        title: 'How to Verify Genuine ISI Mark on Two-Wheeler Helmets',
        summary: 'Under the Ministry of Road Transport & Highways mandate, all two-wheeler helmets sold in India must conform to **IS 4151:2015** and bear a genuine ISI Mark with a valid CM/L number.',
        bulletPoints: [
          '**Step 1 - Inspect the Mark**: Look for the official ISI monogram. Directly above or below the mark, it must state the standard number `IS 4151` and an 8-character licence number `CM/L-XXXXXXXX`.',
          '**Step 2 - Verify on BIS Care App**: Open the BIS Care App, click on **"Verify License Details"**, and enter the CM/L number.',
          '**Step 3 - Cross-verify Product Details**: The app will instantly display the manufacturer name, factory address, brand name, model, and licence expiry status.',
          '**Report Fake Marks**: If the brand does not match or the licence is expired/forged, you can lodge an anonymous complaint directly via the app with photo evidence.'
        ],
        highlight: {
          code: 'IS 4151 : 2015',
          name: 'Protective Helmets for Two-Wheeler Riders',
          matchScore: 'Mandatory'
        },
        sources: [
          { code: 'IS 4151 : 2015', clause: 'Clause 6 · Marking Requirements', page: 'Page 11' },
          { code: 'BIS Consumer Guidelines', clause: 'Verification of ISI Marks', page: 'Public Notice' }
        ]
      },
      fallback: {
        title: 'BIS Consumer Protection Framework',
        summary: 'The Bureau of Indian Standards enforces strict consumer protection guidelines against misleading quality marks:',
        bulletPoints: [
          '**Penalty for Forgery**: Under Section 29 of the BIS Act 2016, unauthorized use or forging of the ISI mark is punishable with imprisonment up to 2 years or fines up to ₹5 lakh.',
          '**Redressal Investigation**: Once a complaint is lodged on BIS Care, a designated BIS enforcement officer visits the retailer or manufacturing unit for search and seizure.',
          '**Surveillance Sampling**: BIS regularly collects samples from retail shelves across the nation for independent testing to ensure consistency.',
          '**Helpline Support**: Consumers can also dial the National Consumer Helpline (1915) or BIS Consumer Affairs Cell.'
        ],
        highlight: {
          code: 'BIS Act 2016',
          name: 'Section 29 - Penal Provisions',
          matchScore: 'Statutory'
        },
        sources: [
          { code: 'BIS Act 2016', clause: 'Section 29 & Section 30', page: 'Statutory Gazette' },
          { code: 'Consumer Protection Act', clause: 'Section 84 · Product Liability', page: 'Act 2019' }
        ]
      }
    }
  },

  multilingual: {
    id: 'multilingual',
    path: '/chat/multilingual',
    label: 'MULTILINGUAL ASSISTANCE',
    title: 'Multilingual Assistant',
    badge: 'MULTILINGUAL',
    themeColor: '#0284c7',
    orbTheme: 'multilingual',
    tagline: 'Interact with BIS Assist in Hindi, English, and 8+ regional Indian languages',
    welcome: {
      label: 'BIS MULTILINGUAL CONCIERGE',
      heading: 'Ask BIS in your language',
      description: 'Interact with BIS Assist naturally using English or your preferred Indian language. Ask about standards, certification, or hallmarking in your native tongue.'
    },
    suggestions: [
      {
        icon: 'Languages',
        title: 'Choose my language',
        desc: 'Select preferred interaction language',
        query: 'What Indian languages are currently supported by the BIS Multilingual Assistant?'
      },
      {
        icon: 'MessageSquare',
        title: 'Ask about BIS in Hindi',
        desc: 'हिंदी में बीआईएस सहायता',
        query: 'आईएसआई (ISI) मार्क क्या है और यह उपभोक्ता सुरक्षा के लिए क्यों आवश्यक है?'
      },
      {
        icon: 'HelpCircle',
        title: 'Explain certification in vernacular',
        desc: 'Simple regional language guide',
        query: 'छोट्या उद्योगांसाठी बीआयएस (BIS) परवाना कसा मिळवायचा? (How to get BIS license in Marathi?)'
      },
      {
        icon: 'Globe',
        title: 'Help me in my language',
        desc: 'Dialect and script support',
        query: 'Can you provide a summary of hallmarking purity standards in Tamil (தமிழ்) and Malayalam (മലയാളം)?'
      }
    ],
    contextPanel: {
      type: 'multilingual',
      heading: 'Supported Indian Languages',
      subheading: 'Natural Language Processing & Voice Support',
      badge: 'BHASHINI COMPATIBLE',
      languages: [
        { code: 'en', name: 'English', native: 'English', active: true },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी', active: false },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்', active: false },
        { code: 'te', name: 'Telugu', native: 'తెలుగు', active: false },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', active: false },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം', active: false },
        { code: 'bn', name: 'Bengali', native: 'বাংলা', active: false },
        { code: 'mr', name: 'Marathi', native: 'मराठी', active: false },
        { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', active: false },
        { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', active: false }
      ],
      quickActions: [
        { label: 'Voice Input Mode (Microphone)', url: '#' },
        { label: 'Toggle Bilingual Responses (EN + Native)', url: '#' },
        { label: 'Download Regional Standards Summaries', url: '#' }
      ]
    },
    defaultResponses: {
      'आईएसआई (ISI) मार्क क्या है और यह उपभोक्ता सुरक्षा के लिए क्यों आवश्यक है?': {
        title: 'आईएसआई मार्क (ISI Mark) और उपभोक्ता सुरक्षा',
        summary: 'आईएसआई मार्क (ISI Mark) भारतीय मानक ब्यूरो (BIS) द्वारा प्रदान किया जाने वाला गुणवत्ता और सुरक्षा का आधिकारिक प्रमाणन चिह्न है:',
        bulletPoints: [
          '**गुणवत्ता की गारंटी**: यह प्रमाणित करता है कि उत्पाद प्रासंगिक भारतीय मानक (Indian Standard) के कड़े परीक्षण और सुरक्षा मानकों पर खरा उतरा है।',
          '**अनिवार्य उत्पाद**: हेलमेट, एलपीजी सिलेंडर, पीने का पानी, इलेक्ट्रॉनिक उपकरण और शिशु आहार जैसे उत्पादों के लिए आईएसआई मार्क कानूनी रूप से अनिवार्य है।',
          '**सीएम/एल नंबर (CM/L Number)**: हर असली आईएसआई मार्क के नीचे 7 या 8 अंकों का विशिष्ट लाइसेंस नंबर (CM/L) अंकित होता है जिसे बीआईएस केयर ऐप पर सत्यापित किया जा सकता है।',
          '**सुरक्षा कवच**: घटिया या नकली आईएसआई मार्क वाले उत्पादों की शिकायत बीआईएस पोर्टल पर दर्ज की जा सकती है।'
        ],
        highlight: {
          code: 'मानक चिन्ह (ISI)',
          name: 'भारतीय मानक ब्यूरो प्रमाणन',
          matchScore: 'आधिकारिक'
        },
        sources: [
          { code: 'BIS अधिनियम 2016', clause: 'धारा 16 (अनिवार्य प्रमाणन)', page: 'राजपत्र' },
          { code: 'उपभोक्ता मार्गदर्शिका', clause: 'गुणवत्ता आश्वासन खंड', page: 'पृष्ठ 4' }
        ]
      },
      fallback: {
        title: 'BIS Multilingual Engine Intelligence',
        summary: 'BIS Assist is engineered to provide accessible quality and standards intelligence across 10+ scheduled Indian languages:',
        bulletPoints: [
          '**Cross-Lingual Retrieval**: Technical standards written in English are semantically mapped and explained in natural regional vernacular phrasing.',
          '**Supported Languages**: Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, and English.',
          '**Preserving Technical Accuracy**: Indian Standard codes (e.g., IS 10500, IS 17803) and legal definitions remain precise while explanations are simplified.',
          '**Voice Enabled (Preview)**: Designed for voice dictation and screen-reading accessibility for grassroots MSME entrepreneurs.'
        ],
        highlight: {
          code: '10+ Languages',
          name: 'Pan-India Linguistic Accessibility',
          matchScore: 'Active'
        },
        sources: [
          { code: 'Bhashini AI Initiative', clause: 'National Language Translation', page: 'MeitY' },
          { code: 'BIS Multilingual Charter', clause: 'Citizen Quality Accessibility', page: 'Page 2' }
        ]
      }
    }
  }
};

export const RECENT_CHATS = [
  { id: '1', domain: 'standards', title: 'Stainless steel bottle standard', time: '10m ago' },
  { id: '2', domain: 'certification', title: 'BIS certification requirements for LEDs', time: '2h ago' },
  { id: '3', domain: 'hallmarking', title: 'IS 1417 916 gold hallmark verification', time: 'Yesterday' },
  { id: '4', domain: 'laboratory', title: 'Testing labs in Maharashtra for solar', time: '3d ago' },
  { id: '5', domain: 'consumer', title: 'Verify helmet ISI mark CM/L number', time: '4d ago' }
];
