'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Calendar, Users, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src={siteConfig.logo} 
            alt={siteConfig.name}
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="hidden font-bold text-xl sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/events" className="transition-colors hover:text-primary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-primary">
            Gallery
          </Link>
          <Link href="/community" className="transition-colors hover:text-primary flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </Link>
          <Link href="/partner" className="transition-colors hover:text-primary flex items-center gap-2">
            <Handshake className="h-4 w-4" />
            Partner
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button asChild variant="outline">
            <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
              WhatsApp
            </Link>
          </Button>
          <Button asChild>
            <Link href="/events">
              Buy Tickets
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 space-y-3">
            <Link 
              href="/events" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/gallery" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              href="/community" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              href="/partner" 
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partner With Us
            </Link>
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                  WhatsApp
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/events">
                  Buy Tickets
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
