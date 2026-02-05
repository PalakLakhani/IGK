// Sample events with future dates for demo
// All dates are set relative to "now" to ensure proper upcoming/past classification
const now = new Date();
const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

export const sampleEvents = [
  {
    slug: 'holi-festival-berlin-2025',
    title: 'Holi Festival of Colors - Berlin 2025',
    category: 'Holi',
    startDateTime: addDays(45).toISOString(),
    date: addDays(45),
    time: '14:00',
    endTime: '22:00',
    city: 'Berlin',
    venue: 'Tempelhofer Feld',
    venueAddress: 'Tempelhofer Damm, 12101 Berlin',
    googleMapsUrl: 'https://maps.google.com/?q=Tempelhofer+Feld+Berlin',
    poster: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=1200&h=800&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=1200&h=800&fit=crop',
    // New content fields
    heroTagline: 'Experience the most vibrant Holi celebration in Berlin!',
    shortSummary: 'Join us for the biggest Holi celebration in Berlin! Dance to Bollywood beats, enjoy authentic Indian food, and celebrate with the community.',
    description: 'Join us for the most vibrant Holi celebration in Berlin! Experience the joy of colors, dance to Bollywood beats, and celebrate spring with the Indian community.\n\nWhat to Expect:\n• Authentic organic colors (safe for skin & environment)\n• Live DJ playing Bollywood & Punjabi hits\n• Traditional Indian street food & drinks\n• Photo booths with colorful backdrops\n• Dance performances & competitions\n• Kids zone with special activities',
    rules: [
      'Minimum age: 16 years (under 18 must be accompanied by adult)',
      'Wear white or light-colored clothes',
      'No glass bottles or outside alcohol'
    ],
    faqs: [
      { question: 'Are the colors safe for skin?', answer: 'Yes! We use only premium organic, non-toxic colors.' },
      { question: 'Can I bring my own colors?', answer: 'No, only our provided colors are allowed.' }
    ],
    schedule: [
      { time: '14:00', activity: 'Gates Open & Registration' },
      { time: '15:00', activity: 'Opening Ceremony & Dance Performance' },
      { time: '15:30', activity: 'Color Play Begins!' }
    ],
    ticketPlatforms: {
      desipassUrl: 'https://desipass.de/holi-berlin-2025',
      eventbriteUrl: 'https://eventbrite.com/holi-berlin-2025'
    },
    desipassUrl: 'https://desipass.de/holi-berlin-2025',
    eventbriteUrl: 'https://eventbrite.com/holi-berlin-2025',
    capacity: 1700,
    status: 'published',
    statusOverride: 'auto',
    featured: true,
    brand: 'Holi Bash Europe',
    tags: ['holi', 'festival', 'berlin', 'colors', 'bollywood']
  },
  {
    slug: 'bollywood-night-munich-2025',
    title: 'Bollywood Night - Munich',
    category: 'Bollywood Night',
    startDateTime: addDays(8).toISOString(),
    date: addDays(8),
    time: '20:00',
    endTime: '03:00',
    city: 'Munich',
    venue: 'Zenith Kulturhalle',
    venueAddress: 'Lilienthalallee 29, 80939 Munich',
    googleMapsUrl: 'https://maps.google.com/?q=Zenith+Kulturhalle+Munich',
    poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
    // New content fields - NO city-specific marketing copy
    heroTagline: 'Dance the night away to the biggest Bollywood hits!',
    shortSummary: 'A premium nightclub experience with top DJs spinning the best Bollywood, Punjabi and Hindi hits all night long.',
    description: 'Get ready for an unforgettable night of music, dance, and entertainment. Our top DJs will be spinning the best Bollywood, Punjabi, and Hindi hits all night long.\n\nDress code: Smart casual\nAge: 18+ only (ID required)',
    rules: ['Age 18+ only (ID required)', 'Smart casual dress code enforced'],
    faqs: [
      { question: 'What is the age limit?', answer: '18+ only. Valid ID must be presented at entry.' }
    ],
    schedule: [
      { time: '20:00', activity: 'Doors Open' },
      { time: '21:00', activity: 'DJ Set Begins' }
    ],
    ticketPlatforms: {
      desipassUrl: 'https://desipass.de/bollywood-night-munich',
      eventbriteUrl: ''
    },
    desipassUrl: 'https://desipass.de/bollywood-night-munich',
    capacity: 950,
    status: 'published',
    statusOverride: 'auto',
    featured: true,
    brand: 'BIG',
    tags: ['bollywood', 'nightlife', 'munich', 'party']
  },
  {
    slug: 'navratri-garba-night-frankfurt-2025',
    title: 'Navratri Garba Night - Frankfurt',
    category: 'Garba',
    startDateTime: addDays(60).toISOString(),
    date: addDays(60),
    time: '19:00',
    endTime: '01:00',
    city: 'Frankfurt',
    venue: 'Jahrhunderthalle Frankfurt',
    venueAddress: 'Pfaffenwiese 301, 65929 Frankfurt',
    googleMapsUrl: 'https://maps.google.com/?q=Jahrhunderthalle+Frankfurt',
    poster: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=1200&h=800&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=1200&h=800&fit=crop',
    // New content fields
    heroTagline: 'Celebrate Navratri with traditional Garba and Dandiya!',
    shortSummary: 'An authentic Navratri celebration with traditional Garba, Dandiya, live music, and delicious food. All ages welcome!',
    description: 'Celebrate Navratri with traditional Garba and Dandiya! An authentic cultural evening with live music and delicious food.\n\nAll ages welcome (kids under 12 free with adult).',
    rules: ['All ages welcome (kids under 12 free with adult)'],
    faqs: [
      { question: 'Do I need to know Garba?', answer: 'Not at all! We have instructors to help you learn.' }
    ],
    schedule: [
      { time: '19:00', activity: 'Registration & Welcome' },
      { time: '19:30', activity: 'Opening Ceremony' }
    ],
    ticketPlatforms: {
      desipassUrl: 'https://desipass.de/garba-frankfurt',
      eventbriteUrl: 'https://eventbrite.com/garba-frankfurt'
    },
    desipassUrl: 'https://desipass.de/garba-frankfurt',
    eventbriteUrl: 'https://eventbrite.com/garba-frankfurt',
    capacity: 700,
    status: 'published',
    statusOverride: 'auto',
    featured: false,
    brand: 'Navaratri Fiesta Europe',
    tags: ['navratri', 'garba', 'dandiya', 'frankfurt']
  },
  {
    slug: 'diwali-celebration-berlin-2025',
    title: 'Diwali Celebration - Berlin',
    category: 'Cultural',
    startDateTime: addDays(30).toISOString(),
    date: addDays(30),
    time: '17:00',
    endTime: '22:00',
    city: 'Berlin',
    venue: 'Haus der Kulturen der Welt',
    venueAddress: 'John-Foster-Dulles-Allee 10, 10557 Berlin',
    poster: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&h=800&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&h=800&fit=crop',
    // New content fields
    heroTagline: 'Celebrate the Festival of Lights with us in Berlin!',
    shortSummary: 'Experience the magic of Diwali with traditional ceremonies, dance performances, and delicious Indian food.',
    description: 'Celebrate the Festival of Lights with traditional ceremonies, dance performances, and delicious food! A family-friendly event.',
    rules: [],
    faqs: [],
    schedule: [],
    ticketPlatforms: {
      desipassUrl: 'https://desipass.de/diwali-berlin',
      eventbriteUrl: ''
    },
    desipassUrl: 'https://desipass.de/diwali-berlin',
    capacity: 500,
    status: 'published',
    statusOverride: 'auto',
    featured: true,
    brand: 'IGK',
    tags: ['diwali', 'cultural', 'berlin', 'family']
  }
];
