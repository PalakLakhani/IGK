// Our Brands - External event brands (NOT including IGK umbrella)
export const brands = [
  {
    id: 'big',
    name: 'Bollywood in Germany',
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
    logo: 'https://customer-assets.emergentagent.com/job_d7d80bcc-5c32-4045-9e3e-ee5deaf0958a/artifacts/riq41sll_IGK-Holi%20%281%29.png',
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
    logo: 'https://customer-assets.emergentagent.com/job_d7d80bcc-5c32-4045-9e3e-ee5deaf0958a/artifacts/rn4yi8st_Navaratri%20Fiesta%20Europe.png',
    instagram: 'https://www.instagram.com/navaratri_fiesta_europe',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-white',
    about: 'Navaratri Fiesta Europe celebrates the nine nights of Navaratri with traditional Garba and Dandiya Raas across European cities, bringing authentic Gujarati culture and community together.',
    categories: ['Garba', 'Navratri']
  },
  {
    id: 'jam2gather',
    name: 'Jam2Gather Germany',
    fullName: 'Jam2Gather Germany',
    slug: 'jam2gather',
    description: 'Musical jamming sessions and community gatherings',
    logo: 'https://customer-assets.emergentagent.com/job_0ab1a7a5-135d-473c-aab3-4e5bf14e34db/artifacts/m91w5xil_image.png',
    instagram: 'https://www.instagram.com/jam2gather_germany',
    color: 'from-purple-500 to-blue-500',
    bgColor: 'bg-gradient-to-br from-purple-100 to-blue-100',
    about: 'Jam2Gather Germany brings musicians and music lovers together for unforgettable jamming sessions, open mics, and community events celebrating the joy of music.',
    categories: ['Music', 'Community']
  },
  {
    id: 'bhajan-clubbing',
    name: 'Bhajan Clubbing Germany',
    fullName: 'Bhajan Clubbing Germany',
    slug: 'bhajan-clubbing',
    description: 'Spiritual bhajans meets modern clubbing experience',
    logo: 'https://customer-assets.emergentagent.com/job_0ab1a7a5-135d-473c-aab3-4e5bf14e34db/artifacts/iwp1z6qz_image.png',
    instagram: 'https://www.instagram.com/bhajanclubbing_germany',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100',
    about: 'Bhajan Clubbing Germany offers a unique fusion of traditional spiritual bhajans with modern clubbing vibes - a transformative experience that uplifts the soul.',
    categories: ['Bhajan', 'Spiritual', 'Trending']
  }
];

export const getBrandBySlug = (slug) => {
  return brands.find(brand => brand.slug === slug);
};

export const getBrandById = (id) => {
  return brands.find(brand => brand.id === id);
};
