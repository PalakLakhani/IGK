export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'IGK Events',
  tagline: 'Bridging Nations, Creating Opportunities',
  description: 'Curated events & experiences across Germany - Holi, Bollywood Nights, Garba, Weddings, and more',
  logo: 'https://customer-assets.emergentagent.com/job_0e9453d3-b628-4be1-8a9d-95c6b0eeae8b/artifacts/snpr9tbt_Original%20PNG.png',
  
  // Fixed stats - Single source of truth for the entire site
  stats: {
    eventsOrganized: 50,      // Display as "50+"
    happyAttendees: 25000,    // Display as "25K+"
    citiesCovered: 8,         // Display as "8"
    // averageRating is computed dynamically from reviews
  },

  contact: {
    email: 'igkonnekt@gmail.com',
    whatsapp: '+4917657722110',
    phone: '+49 176 57722110',
    address: 'Germany'
  },
  
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/igkonnekt',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/igkonnekt',
    linkedin: 'https://linkedin.com/company/igkonnekt',
    whatsapp: '+4917657722110',
    linktree: 'https://linktr.ee/igkonnekt'
  },
  
  theme: {
    primaryColor: '#FF385C',
    accentColor: '#FFD700',
    secondaryColor: '#00CED1',
    purple: '#9B4DCA',
    orange: '#FF6B35',
    green: '#00D9A3'
  },
  
  // External ticketing - ONLY external platforms, no on-site ticket sales
  externalTicketing: {
    desipass: 'https://t.ly/igk-events',
    eventbrite: 'https://www.eventbrite.com/cc/igk-events-2888509?utm-campaign=social&utm-content=creatorshare&utm-medium=discovery&utm-term=odclsxcollection&utm-source=cp&aff=escb'
  },

  // Hero image (static image, no video)
  heroImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop',

  // DesiPass events to feature
  desipassEvents: [
    {
      eventId: '01KFGQC5TH7MJ7R58V1Q5PSTAK',
      url: 'https://www.desipass.com/events/events-details?eventId=01KFGQC5TH7MJ7R58V1Q5PSTAK'
    },
    {
      eventId: '01KGAHGE2M0213NYZBFPZ8WT5Y',
      url: 'https://www.desipass.com/events/events-details?eventId=01KGAHGE2M0213NYZBFPZ8WT5Y'
    }
  ]
};
