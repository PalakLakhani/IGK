// Our Brands - External event brands (NOT including IGK umbrella)
export const brands = [
  {
    id: 'big',
    name: 'BIG',
    fullName: 'Bollywood in Germany',
    slug: 'big',
    description: 'Concerts, Bollywood DJ nights, and club shows',
    logo: 'https://customer-assets.emergentagent.com/job_festivalify/artifacts/xm6bk9vz_BIG.png',
    instagram: 'https://www.instagram.com/bollywood_in_germany',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-black',
    about: 'BIG (Bollywood in Germany) brings the best of Bollywood entertainment to Germany with electrifying DJ nights, spectacular concerts, and unforgettable club shows featuring top artists and DJs.',
    categories: ['Bollywood Night', 'Concert']
  },
  {
    id: 'holibash',
    name: 'Holi Bash Europe',
    fullName: 'Holi Bash Europe',
    slug: 'holibash',
    description: 'Open-air Holi festivals and color celebrations',
    logo: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=200&h=200&fit=crop',
    instagram: 'https://www.instagram.com/holi_bash_europe',
    color: 'from-pink-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-pink-100 to-orange-100',
    about: 'Holi Bash Europe organizes the most vibrant and authentic Holi celebrations across Europe with safe organic colors, live music, and traditional festivities in stunning open-air venues.',
    categories: ['Holi']
  },
  {
    id: 'navaratri',
    name: 'Navaratri Fiesta Europe',
    fullName: 'Navaratri Fiesta Europe',
    slug: 'navaratri',
    description: 'Garba, Dandiya nights, and Navaratri tours',
    logo: 'https://customer-assets.emergentagent.com/job_festivalify/artifacts/gsrxz3e2_Schwarz%20Gold%20Rund%20Geometrisch%20Professionell%20Immobilien%20Logo%20%281%29.png',
    instagram: 'https://www.instagram.com/navaratri_fiesta_europe',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-white',
    about: 'Navaratri Fiesta Europe celebrates the nine nights of Navaratri with traditional Garba and Dandiya Raas across European cities, bringing authentic Gujarati culture and community together.',
    categories: ['Garba', 'Navratri']
  }
];

export const getBrandBySlug = (slug) => {
  return brands.find(brand => brand.slug === slug);
};

export const getBrandById = (id) => {
  return brands.find(brand => brand.id === id);
};
