'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, MessageCircle, Linkedin, Mail, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import NewsletterSubscribe from './NewsletterSubscribe';
import OurBrands from './OurBrands';

export default function Footer() {
  // Unified Quick Links (matching header nav + extras)
  const quickLinks = [
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/community', label: 'Community' },
    { href: '/partner', label: 'Partners' },
    { href: '/contact', label: 'Contact' },
    { href: '/testimonials', label: 'Share Your Experience' },
  ];

  // Legal Links
  const legalLinks = [
    { href: '/impressum', label: 'Impressum' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/datenschutz', label: 'Privacy Policy (GDPR)' },
  ];

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image 
                src={siteConfig.logo} 
                alt="IGK"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {siteConfig.tagline}
            </p>
            <p className="text-sm text-muted-foreground">
              Curated events & experiences across Germany
            </p>
            
            {/* Contact Details */}
            <div className="space-y-2 text-sm">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
              <a href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" />
                {siteConfig.contact.phone}
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <Link href={siteConfig.social.instagram} target="_blank" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href={siteConfig.social.facebook} target="_blank" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href={siteConfig.social.linkedin} target="_blank" className="text-muted-foreground hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="text-muted-foreground hover:text-green-500 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Brands */}
          <OurBrands variant="footer" />

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSubscribe variant="footer" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IGK Events. All rights reserved.</p>
          <p className="mt-1">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
