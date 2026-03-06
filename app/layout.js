import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Toaster } from 'sonner';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://igkonnekt.com'),
  title: {
    default: 'IGK - Premium Indian Events & Cultural Experiences in Germany',
    template: '%s | IGK Events'
  },
  description: 'Join 25,000+ attendees at IGK\'s premium Indian events across Germany. Experience Holi festivals, Bollywood nights, Garba celebrations, weddings & more in Berlin, Munich, Frankfurt & beyond.',
  keywords: [
    'Indian events Germany',
    'Holi festival Germany',
    'Bollywood party Berlin',
    'Garba night Munich',
    'Indian wedding Germany',
    'Diwali celebration Frankfurt',
    'Indian expat events',
    'cultural events Germany',
    'IGK events',
    'Indo-German events'
  ],
  authors: [{ name: 'IGK - Indo-German Konnekt' }],
  creator: 'IGK - Indo-German Konnekt',
  publisher: 'IGK - Indo-German Konnekt',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: 'https://customer-assets.emergentagent.com/job_0e9453d3-b628-4be1-8a9d-95c6b0eeae8b/artifacts/snpr9tbt_Original%20PNG.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: 'https://customer-assets.emergentagent.com/job_0e9453d3-b628-4be1-8a9d-95c6b0eeae8b/artifacts/snpr9tbt_Original%20PNG.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    url: 'https://igkonnekt.com',
    siteName: 'IGK - Indo-German Konnekt',
    title: 'IGK - Premium Indian Events & Cultural Experiences in Germany',
    description: 'Join 25,000+ attendees at IGK\'s premium Indian events across Germany. Experience Holi festivals, Bollywood nights, Garba celebrations & more.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'IGK Events - Vibrant Indian Cultural Celebrations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IGK - Premium Indian Events in Germany',
    description: 'Join 25,000+ attendees at premium Indian events. Holi, Bollywood, Garba & more across Germany.',
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=630&fit=crop'],
    creator: '@igkonnekt',
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://igkonnekt.com',
  },
  category: 'Events & Entertainment',
};

// JSON-LD Structured Data for Organization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IGK - Indo-German Konnekt',
  alternateName: 'IGK Events',
  url: 'https://igkonnekt.com',
  logo: siteConfig.logo,
  description: 'Premium Indian cultural events and experiences across Germany',
  foundingDate: '2020',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'DE',
    addressLocality: 'Germany'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    contactType: 'customer service',
    availableLanguage: ['English', 'German', 'Hindi']
  },
  sameAs: [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
    siteConfig.social.linktree
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '500',
    bestRating: '5',
    worstRating: '1'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
