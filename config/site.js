export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'IGK Events',
  description: 'Premium Indian cultural events across Germany - Holi, Bollywood Nights, Garba, and more',
  logo: 'https://customer-assets.emergentagent.com/job_0e9453d3-b628-4be1-8a9d-95c6b0eeae8b/artifacts/qljlkiei_Original%20PNG.png',
  
  contact: {
    email: 'info@igkevents.com',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+491234567890',
    phone: '+49 123 456 7890',
    address: 'Berlin, Germany'
  },
  
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/igkevents',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/igkevents',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+491234567890',
    linktree: 'https://linktr.ee/indianexpatsingermany'
  },
  
  theme: {
    primaryColor: '#FF385C', // Vibrant Pink/Red
    accentColor: '#FFD700', // Bright Gold
    secondaryColor: '#00CED1', // Bright Turquoise
    purple: '#9B4DCA', // Vibrant Purple
    orange: '#FF6B35', // Bright Orange
    green: '#00D9A3' // Bright Green
  },
  
  externalTicketing: {
    desipass: 'https://desipass.de',
    eventbrite: 'https://eventbrite.com'
  }
};
