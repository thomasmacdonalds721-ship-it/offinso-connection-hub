/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BidItem, JobPost, ReliefProgram, TravelPackage } from './types';

export const INITIAL_AUCTION_ITEMS: BidItem[] = [];

export const INITIAL_JOBS: JobPost[] = [
  {
    id: 'job_1',
    title: 'Programs Coordinator',
    company: 'Offensal Private Hub',
    location: 'Offinso Town Center',
    type: 'Full-time',
    category: 'Healthcare & Social',
    salaryRange: 'GH₵750 / Month',
    postedAt: '2026-06-18',
    description: 'Lead and manage the daily operations of relief disbursements, community food stamps, and trade bursary initiatives in the Offinso municipality. Duties include scheduling outreach clinics, communicating with verified beneficiaries, writing performance audits, and verifying eligibility criteria.',
    requirements: [
      'Prior experience coordinating aid or managing local cooperative outreach',
      'High proficiency in digital record keeping, spreadsheets, and database inputs',
      'Fluent conversational command of English and Twi languages',
      'Strong organizational skills with a passion for humanitarian program implementation'
    ],
    isGig: false
  },
  {
    id: 'job_2',
    title: 'Construction Laborer',
    company: 'Multiple Employers',
    location: 'Offinso Central / Abofour',
    type: 'Full-time',
    category: 'Manufacturing & Trade',
    salaryRange: 'To be discussed',
    postedAt: '2026-06-20',
    description: 'Assist in executing vital municipal infrastructure and community craft school projects. Responsible for hauling structural materials, mixing masonry concrete, setting up safety layouts, and assisting master carpenters or roofers.',
    requirements: [
      'Excellent physical sturdiness and physical endurance for manual site activities',
      'Ability to strictly follow safety instructions and work well in collaborative crews',
      'Comfortable operating manual shovels, wheelbarrows, and power tools',
      'Punctual and dedicated team player'
    ],
    isGig: true
  },
  {
    id: 'job_3',
    title: 'Farm Laborer',
    company: 'Multiple Employers',
    location: 'Abofour District (Offinso North)',
    type: 'Seasonal',
    category: 'Agriculture & Forestry',
    salaryRange: 'To be discussed',
    postedAt: '2026-06-22',
    description: 'Join our cultivation squads in organic farming operations. Activities include planting climate-resistant cocoa seedlings, clearing invasive weeds, harvesting ripe cocoa pods, loading bean crates, and supporting solar-drying platform maintenance.',
    requirements: [
      'Sturdy physical health to carry out outdoor field tasks in high humidity',
      'Basic knowledge of farming tools or general agricultural procedures',
      'Willingness to learn organic crop treatment and shading standards',
      'A great spirit for cooperative group farming'
    ],
    isGig: true
  },
  {
    id: 'job_4',
    title: 'Fashion Designer',
    company: 'Multiple Employers',
    location: 'Offinso Town Center',
    type: 'Contract',
    category: 'Manufacturing & Trade',
    salaryRange: 'GH₵95 / Project',
    postedAt: '2026-06-24',
    description: 'Experienced fashion designer or tailor needed for sewing custom traditional clothing and fitting municipal choir uniforms. Must have access to functional sewing equipment.',
    requirements: [
      'Demonstrated sewing, tailoring, or pattern design experience',
      'Familiarity with local Ashanti print fabrics and traditional styles',
      'Access to a reliable sewing machine and tailoring accessories',
      'Punctuality and high attention to detail'
    ],
    isGig: true
  }
];

export const INITIAL_RELIEF_PROGRAMS: ReliefProgram[] = [
  {
    id: 'rp_1',
    name: 'Low income family Food Stamps',
    description: 'Critical nutritional aid designed for struggling households in the Offinso municipality. This program delivers monthly food stamp vouchers redeemable at approved local food markets and municipal cooperatives for fresh produce, grain items, and staple groceries.',
    reliefAmount: 'Monthly vouchers up to GH₵500 value per family',
    eligibility: 'Vulnerable low-income families residing inside Offinso municipal lines, subject to verification by the district assembly.'
  },
  {
    id: 'rp_2',
    name: 'Entry Fee for trading school Rebate',
    description: 'Educational financial support created to ease the burden of vocational enrollment. Under this active relief scheme, newly enrolled students are eligible for direct rebates of their registration and entry fees at accredited regional trading and craft schools.',
    reliefAmount: 'Direct refund rebate of GH₵2,000',
    eligibility: 'Newly registered students in trading, commercial trade, or vocational guilds in Offinso.'
  },
  {
    id: 'rp_3',
    name: 'Small grants for youth entreprenuers in TRADE',
    description: 'Empowering local commerce and micro-enterprise growth. This scheme awards non-repayable grants to young emerging retail, transport, and cooperative trade actors to help purchase raw inventory, tools, or commercial products.',
    reliefAmount: 'Direct micro-grant of GH₵3,000',
    eligibility: 'Unemployed or aspiring self-employed youth (ages 18-35) starting or expanding a trade business in Offinso.'
  },
  {
    id: 'rp_4',
    name: 'School Supplies for the Low Income Families',
    description: 'Ensuring equitable access to primary education. This program organizes the distribution of educational toolkits comprising standardized uniform fabrics, books, geometric drawing sets, and physical stationery directly to students in need.',
    reliefAmount: 'Bespoke scholastic supply kits valued at GH₵1,000',
    eligibility: 'Families with enrolled primary or JHS pupils facing verified financial setbacks.'
  }
];

export const INITIAL_TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 'trp_canada',
    title: 'Canada Visit Visa',
    duration: 'Processing: 6-12 Weeks',
    price: 3500,
    rating: 4.9,
    description: 'We offer specialized visa processing for individuals seeking to travel, explore, or visit family in Canada. This complete package is fully managed by NAY TRAVEL COMPANY, guaranteeing professional oversight and high-quality verification of all required documentation.',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=600&auto=format&fit=crop',
    inclusions: [
      'Official Bank Draft assistance',
      'Verified Invitation Letter procurement',
      'Full Application Document Audit & Review',
      'Biometrics Scheduling & Mock Interview Prep'
    ],
    tags: ['Canada', 'Visit Visa', 'NAY Travel']
  },
  {
    id: 'trp_uk',
    title: 'United Kingdom Visit Visa',
    duration: 'Processing: 3-6 Weeks',
    price: 3000,
    rating: 4.8,
    description: 'Explore historical cities or reunite with family in the UK. Managed by NAY TRAVEL COMPANY, we assist you through the UK Visas and Immigration (UKVI) standards, ensuring your documentation, funds, and intentions are perfectly compiled.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
    inclusions: [
      'Financial Sponsorship documentation aid',
      'Detailed Itinerary & Accommodation Planning',
      'Application submission on official portal',
      'Document Scanning & Upload support'
    ],
    tags: ['United Kingdom', 'Visit Visa', 'NAY Travel']
  },
  {
    id: 'trp_schengen',
    title: 'Schengen Tourist Visa (Europe)',
    duration: 'Processing: 4-8 Weeks',
    price: 2800,
    rating: 4.7,
    description: 'Embark on a scenic tour across 29 European nations in the Schengen Area. Under the elite guidance of NAY TRAVEL COMPANY, we ensure your flight reservations, travel insurance, hotel bookings, and host sponsorship requirements align perfectly with embassy mandates.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop',
    inclusions: [
      'Hotel Reservation & Flight Itinerary facilitation',
      'Travel Medical Insurance alignment',
      'Covering Letter drafting guidance',
      'Schengen Embassy Appointment scheduling'
    ],
    tags: ['Europe', 'Schengen Area', 'NAY Travel']
  }
];

export const OFFINSO_COMMUNITY_STATS = {
  municipalityPopulation: 168500,
  activeAuctions: 14,
  jobsFilledThisMonth: 112,
  reliefFundsDisbursed: 'GH₵850K'
};

export const OFFINSO_NEWS_HIGHLIGHTS = [
  {
    id: 'news_1',
    date: 'June 15, 2026',
    title: 'Private Census Ongoing Now!',
    summary: 'provide your information so we can help understand the demographics of the community.',
    category: 'Statistics'
  },
  {
    id: 'news_2',
    date: 'June 10, 2026',
    title: 'Offinso Women Shea Butter Mechanization Center Opens Officially',
    summary: 'A public-spirited international donation has funded a complete mechanical grinder setup and high-volume filtering press in Offinso Town Center, doubling production speeds for cooperative households.',
    category: 'Economic Growth'
  },
  {
    id: 'news_3',
    date: 'June 08, 2026',
    title: 'Reforestation Partnership Deploys Youth Seedlings Patrols',
    summary: 'The Municipal Forestry Division launches sustainable job opportunities for 50 unemployed youth to protect primary mahogany nurseries and actively prevent illegal timber harvesting in sanctuary outskirts.',
    category: 'Conservation'
  }
];

export const INITIAL_CLASS_OFFERINGS = [
  {
    id: 'basic_reading',
    title: 'Basic Reading, Writing & Numeracy',
    twiTitle: 'Akenkan, Atwerɛ ne Atontaabuo',
    description: 'Foundational classes designed for adult learners wanting to achieve fully functional literacy in both Ashanti Twi and English.',
    duration: '12 Weeks',
    schedule: 'Tues & Thurs, 4:00 PM - 6:00 PM',
    age: 'Adults & Young Adults',
  },
  {
    id: 'health_safety_workplace',
    title: 'Health & Safety in the Workplace',
    twiTitle: 'Apɔmuden ne Ahotɔ wɔ Adwumayɛbea',
    description: 'Self-paced online training covering workplace safety protocols, hygiene, emergency response, first aid basics, hazard reporting, and preventive health — complete 6 interactive modules and earn your certificate.',
    duration: 'Self-Paced Online',
    schedule: '6 Modules · ~45 Minutes',
    age: 'All Active Laborers & Cooperatives',
  }
];
