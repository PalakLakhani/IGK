export const sampleEvents = [
  {
    slug: 'holi-festival-berlin-2025',
    title: 'Holi Festival of Colors - Berlin 2025',
    category: 'Holi',
    date: new Date('2026-03-15T14:00:00'),
    endTime: '22:00',
    city: 'Berlin',
    venue: 'Tempelhofer Feld',
    venueAddress: 'Tempelhofer Damm, 12101 Berlin',
    googleMapsUrl: 'https://maps.google.com/?q=Tempelhofer+Feld+Berlin',
    poster: 'https://images.unsplash.com/photo-1583241800698-e8f1a4c64e1e?w=1200&h=800&fit=crop',
    description: 'Join us for the most vibrant Holi celebration in Berlin! Experience the joy of colors, dance to Bollywood beats, and celebrate spring with the Indian community.',
    longDescription: `🎨 Get ready for the biggest Holi celebration in Berlin!

Experience the festival of colors like never before at Tempelhofer Feld. This year's Holi Bash promises to be an unforgettable celebration of culture, music, and community.

✨ What to Expect:
• Authentic organic colors (safe for skin & environment)
• Live DJ playing Bollywood & Punjabi hits
• Traditional Indian street food & drinks
• Photo booths with colorful backdrops
• Dance performances & competitions
• Kids zone with special activities

🎵 Music Lineup:
DJ Arjun, DJ Priya, and special guest performers will keep you dancing all day!

🍛 Food & Drinks:
Authentic Indian street food including samosas, chaat, golgappas, lassi, and more!

👕 What to Wear:
White or light-colored clothes that you don't mind getting colorful! We recommend old clothes and closed shoes.

🎟️ Ticket Includes:
• Entry to the festival
• 200g of premium organic colors
• Welcome drink
• Access to all activities and performances`,
    rules: [
      'Minimum age: 16 years (under 18 must be accompanied by adult)',
      'Wear white or light-colored clothes',
      'No glass bottles or outside alcohol',
      'Colors provided are organic and safe',
      'Keep valuables in waterproof bags',
      'Follow staff instructions at all times'
    ],
    faqs: [
      {
        question: 'Are the colors safe for skin?',
        answer: 'Yes! We use only premium organic, non-toxic colors that are safe for skin and easily washable.'
      },
      {
        question: 'Can I bring my own colors?',
        answer: 'No, only our provided colors are allowed to ensure safety and quality for all attendees.'
      },
      {
        question: 'Is food included in the ticket?',
        answer: 'Food is available for purchase separately. Various Indian street food stalls will be present.'
      },
      {
        question: 'What if it rains?',
        answer: 'The event will proceed rain or shine. We have covered areas available.'
      }
    ],
    schedule: [
      { time: '14:00', activity: 'Gates Open & Registration' },
      { time: '15:00', activity: 'Opening Ceremony & Dance Performance' },
      { time: '15:30', activity: 'Color Play Begins!' },
      { time: '17:00', activity: 'Live Music & DJ Sets' },
      { time: '19:00', activity: 'Evening Dance Party' },
      { time: '22:00', activity: 'Event Ends' }
    ],
    ticketTypes: [
      {
        id: 'early-bird',
        name: 'Early Bird',
        price: 25,
        stripePriceId: 'price_early_bird',
        description: 'Limited time offer',
        available: true,
        capacity: 500,
        sold: 350
      },
      {
        id: 'regular',
        name: 'Regular Entry',
        price: 35,
        stripePriceId: 'price_regular',
        description: 'Standard entry ticket',
        available: true,
        capacity: 1000,
        sold: 420
      },
      {
        id: 'vip',
        name: 'VIP Pass',
        price: 65,
        stripePriceId: 'price_vip',
        description: 'Includes premium colors, exclusive zone, free food voucher',
        available: true,
        capacity: 200,
        sold: 85
      }
    ],
    externalLinks: {
      desipass: 'https://desipass.de/holi-berlin-2025',
      eventbrite: 'https://eventbrite.com/holi-berlin-2025'
    },
    capacity: 1700,
    status: 'published',
    featured: true,
    tags: ['holi', 'festival', 'berlin', 'colors', 'bollywood', 'indian-culture']
  },
  {
    slug: 'bollywood-night-munich-2025',
    title: 'Bollywood Night - Munich',
    category: 'Bollywood Night',
    date: new Date('2026-04-20T20:00:00'),
    endTime: '03:00',
    city: 'Munich',
    venue: 'Zenith Kulturhalle',
    venueAddress: 'Lilienthalallee 29, 80939 München',
    googleMapsUrl: 'https://maps.google.com/?q=Zenith+Kulturhalle+Munich',
    poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop',
    description: 'Dance the night away to the biggest Bollywood hits! A premium nightclub experience with top DJs, stunning lights, and non-stop entertainment.',
    longDescription: `💃 Munich's Premier Bollywood Night Experience!

Get ready for an unforgettable night of music, dance, and entertainment. Our Bollywood Night brings you the best of Hindi cinema music in a world-class venue.

🎵 Music Experience:
• Latest Bollywood chartbusters
• Classic 90s & 2000s hits
• Punjabi & Hindi mashups
• Live DJ performances
• Special remix sets

✨ Venue Highlights:
• State-of-the-art sound system
• Professional lighting & effects
• Spacious dance floor
• Premium bar with Indian-inspired cocktails
• VIP lounge area
• Professional photography

🍹 Drinks & Food:
Signature cocktails, premium spirits, and light Indian snacks available at the bar.

👗 Dress Code:
Smart casual / Party wear. Show off your style!

🎟️ Ticket Benefits:
• Entry to the exclusive event
• Welcome drink (VIP tickets only)
• Access to all zones
• Professional photo booth`,
    rules: [
      'Age 18+ only (ID required)',
      'Smart casual dress code enforced',
      'No outside food or drinks',
      'Respect other guests and staff',
      'Photography allowed, no professional equipment',
      'No refunds after entry'
    ],
    faqs: [
      {
        question: 'What is the age limit?',
        answer: '18+ only. Valid ID must be presented at entry.'
      },
      {
        question: 'Is there a dress code?',
        answer: 'Yes, smart casual or party wear. No sportswear, flip-flops, or beachwear.'
      },
      {
        question: 'Can I get a refund if I can\'t attend?',
        answer: 'Tickets are non-refundable but transferable to another person.'
      },
      {
        question: 'Is there parking available?',
        answer: 'Yes, the venue has parking facilities. Public transport is also recommended.'
      }
    ],
    schedule: [
      { time: '20:00', activity: 'Doors Open' },
      { time: '21:00', activity: 'DJ Set Begins - Opening Beats' },
      { time: '22:30', activity: 'Peak Hour - Dance Floor Hits' },
      { time: '00:30', activity: 'Midnight Special - Classic Bollywood' },
      { time: '02:00', activity: 'Final Hour - Request Zone' },
      { time: '03:00', activity: 'Event Ends' }
    ],
    ticketTypes: [
      {
        id: 'regular',
        name: 'Regular Entry',
        price: 20,
        stripePriceId: 'price_regular_munich',
        description: 'Standard entry to the event',
        available: true,
        capacity: 800,
        sold: 650
      },
      {
        id: 'vip',
        name: 'VIP Entry',
        price: 45,
        stripePriceId: 'price_vip_munich',
        description: 'VIP zone access, welcome drink, priority entry',
        available: true,
        capacity: 150,
        sold: 120
      }
    ],
    externalLinks: {
      desipass: 'https://desipass.de/bollywood-night-munich',
      eventbrite: 'https://eventbrite.com/bollywood-night-munich'
    },
    capacity: 950,
    status: 'published',
    featured: true,
    tags: ['bollywood', 'nightlife', 'munich', 'party', 'dance', 'dj']
  },
  {
    slug: 'navratri-garba-night-frankfurt-2025',
    title: 'Navratri Garba Night - Frankfurt',
    category: 'Garba',
    date: new Date('2025-10-10T19:00:00'),
    endTime: '01:00',
    city: 'Frankfurt',
    venue: 'Jahrhunderthalle Frankfurt',
    venueAddress: 'Pfaffenwiese 301, 65929 Frankfurt',
    googleMapsUrl: 'https://maps.google.com/?q=Jahrhunderthalle+Frankfurt',
    poster: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=1200&h=800&fit=crop',
    description: 'Celebrate Navratri with traditional Garba and Dandiya! An authentic cultural evening with live music, traditional dance, and festive vibes.',
    longDescription: `🪔 Authentic Navratri Celebration in Frankfurt!

Join us for an enchanting evening of Garba and Dandiya during the auspicious festival of Navratri. Experience the rich traditions of Gujarat in the heart of Germany.

💫 Event Highlights:
• Traditional Garba & Dandiya Raas
• Live Gujarati folk musicians
• Professional dance instructors (for beginners)
• Traditional food stalls
• Colorful decorations & ambiance
• Prize for best dressed
• Kids-friendly environment

🎵 Music & Dance:
Authentic Garba music with both traditional and contemporary fusion tracks. Free dandiya sticks provided!

🍛 Food Court:
Traditional Gujarati thali, fafda, jalebi, dhokla, and festive sweets.

👘 Dress Code:
Traditional Indian attire encouraged (Chaniya Choli, Kurta, Lehenga). Prize for best dressed!

🎟️ What's Included:
• Entry to the event
• Free dandiya sticks
• Access to dance workshops
• Photo booth access`,
    rules: [
      'All ages welcome (kids under 12 free with adult)',
      'Traditional attire preferred but not mandatory',
      'Respectful behavior towards all participants',
      'No smoking or alcohol on premises',
      'Follow dance floor etiquette',
      'Professional cameras not allowed'
    ],
    faqs: [
      {
        question: 'Do I need to know Garba to attend?',
        answer: 'Not at all! We have instructors teaching basic steps throughout the evening.'
      },
      {
        question: 'Are dandiya sticks provided?',
        answer: 'Yes, free dandiya sticks are provided to all attendees.'
      },
      {
        question: 'Can I bring my family?',
        answer: 'Yes! This is a family-friendly event. Children under 12 enter free with an adult.'
      },
      {
        question: 'Is food included?',
        answer: 'Food is available for purchase at our traditional food stalls.'
      }
    ],
    schedule: [
      { time: '19:00', activity: 'Registration & Welcome' },
      { time: '19:30', activity: 'Opening Ceremony & Aarti' },
      { time: '20:00', activity: 'Garba Workshop for Beginners' },
      { time: '20:30', activity: 'Traditional Garba Begins' },
      { time: '22:00', activity: 'Dandiya Raas Session' },
      { time: '23:30', activity: 'Fusion Garba & Competition' },
      { time: '00:30', activity: 'Prize Distribution & Closing' },
      { time: '01:00', activity: 'Event Ends' }
    ],
    ticketTypes: [
      {
        id: 'adult',
        name: 'Adult Entry',
        price: 30,
        stripePriceId: 'price_adult_garba',
        description: 'Entry for adults (13+ years)',
        available: true,
        capacity: 600,
        sold: 380
      },
      {
        id: 'family',
        name: 'Family Pass (2 Adults + 2 Kids)',
        price: 75,
        stripePriceId: 'price_family_garba',
        description: 'Best value for families',
        available: true,
        capacity: 100,
        sold: 65
      }
    ],
    externalLinks: {
      desipass: 'https://desipass.de/garba-frankfurt',
      eventbrite: 'https://eventbrite.com/garba-frankfurt'
    },
    capacity: 700,
    status: 'published',
    featured: false,
    tags: ['navratri', 'garba', 'dandiya', 'frankfurt', 'traditional', 'family-friendly']
  }
];
