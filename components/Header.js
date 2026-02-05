'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Calendar, Users, Handshake, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-md">
      <div className="container flex h-24 items-center justify-between">
        {/* Logo Only - No Text */}
        <Link href="/" className="flex items-center group">
          <Image 
            src={siteConfig.logo} 
            alt={siteConfig.name}
            width={80}
            height={80}
            className="h-20 w-auto transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-base font-bold">
          <Link href="/events" className="transition-colors hover:text-pink-600 flex items-center gap-2 group">
            <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Events
          </Link>
          <Link href="/team" className="transition-colors hover:text-green-600 flex items-center gap-2 group">
            <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Team
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-purple-600 flex items-center gap-2 group">
            <ImageIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Gallery
          </Link>
          <Link href="/community" className="transition-colors hover:text-blue-600 flex items-center gap-2 group">
            <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Community
          </Link>
          <Link href="/partner" className="transition-colors hover:text-orange-600 flex items-center gap-2 group">
            <Handshake className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Partner
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button asChild variant="outline" className="font-bold border-2 hover:border-pink-500 hover:text-pink-600">
            <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
              WhatsApp
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full px-6 shadow-lg">
            <Link href="/events">
              Buy Tickets
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-7 w-7 text-pink-600" /> : <Menu className="h-7 w-7 text-pink-600" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <nav className="container py-6 space-y-4">
            <Link 
              href="/events" 
              className="flex items-center gap-3 py-3 text-lg font-bold transition-colors hover:text-pink-600 border-l-4 border-transparent hover:border-pink-600 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="h-6 w-6" />
              Events
            </Link>
            <Link 
              href="/gallery" 
              className="flex items-center gap-3 py-3 text-lg font-bold transition-colors hover:text-purple-600 border-l-4 border-transparent hover:border-purple-600 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ImageIcon className="h-6 w-6" />
              Gallery
            </Link>
            <Link 
              href="/community" 
              className="flex items-center gap-3 py-3 text-lg font-bold transition-colors hover:text-blue-600 border-l-4 border-transparent hover:border-blue-600 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-6 w-6" />
              Community
            </Link>
            <Link 
              href="/partner" 
              className="flex items-center gap-3 py-3 text-lg font-bold transition-colors hover:text-orange-600 border-l-4 border-transparent hover:border-orange-600 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Handshake className="h-6 w-6" />
              Partner With Us
            </Link>
            <div className="pt-4 space-y-3">
              <Button asChild variant="outline" className="w-full font-bold border-2">
                <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                  WhatsApp
                </Link>
              </Button>
              <Button asChild className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg">
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
