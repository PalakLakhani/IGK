export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'IGK Events',
  tagline: 'Bridging Nations, Creating Opportunities',
  description: 'Curated events & experiences across Germany - Holi, Bollywood Nights, Garba, Weddings, and more',
  logo: 'https://customer-assets.emergentagent.com/job_0e9453d3-b628-4be1-8a9d-95c6b0eeae8b/artifacts/snpr9tbt_Original%20PNG.png',
  
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
  
  externalTicketing: {
    desipass: 'https://desipass.com',
    eventbrite: 'https://eventbrite.com'
  },

  // Hero video (royalty-free from Pexels)
  heroVideo: {
    url: 'https://videos.pexels.com/video-files/6438189/6438189-hd_1920_1080_25fps.mp4',
    poster: 'https://images.pexels.com/videos/6438189/pexels-photo-6438189.jpeg?auto=compress&cs=tinysrgb&w=1920',
    fallbackImage: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=1920&h=1080&fit=crop'
  },

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
