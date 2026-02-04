import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: siteConfig.name + ' - Premium Indian Events in Germany',
  description: siteConfig.description,
  keywords: 'Indian events, Holi, Bollywood, Garba, Germany, Berlin, Munich, Frankfurt, cultural events',
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
