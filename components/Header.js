'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Calendar, Users, Handshake, ImageIcon, Info, MessageSquare, Star, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unified navigation items - shortened labels for header
  const navItems = [
    { href: '/events', label: 'Events', icon: Calendar, color: 'pink' },
    { href: '/about', label: 'About', icon: Info, color: 'blue' },
    { href: '/team', label: 'Team', icon: Users, color: 'green' },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon, color: 'purple' },
    { href: '/spotlight', label: 'Spotlight', icon: Sparkles, color: 'yellow' },
    { href: '/collaborations', label: 'Trusted By', icon: Building2, color: 'indigo' },
    { href: '/community', label: 'Community', icon: MessageSquare, color: 'cyan' },
    { href: '/partner', label: 'Partners', icon: Handshake, color: 'orange' },
    { href: '/contact', label: 'Contact', icon: MessageSquare, color: 'teal' },
  ];

  // Full labels for mobile menu
  const mobileNavItems = [
    { href: '/events', label: 'Events', icon: Calendar, color: 'pink' },
    { href: '/about', label: 'About Us', icon: Info, color: 'blue' },
    { href: '/team', label: 'Team', icon: Users, color: 'green' },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon, color: 'purple' },
    { href: '/spotlight', label: 'In the Spotlight', icon: Sparkles, color: 'yellow' },
    { href: '/collaborations', label: 'Trusted By', icon: Building2, color: 'indigo' },
    { href: '/community', label: 'Community', icon: MessageSquare, color: 'cyan' },
    { href: '/partner', label: 'Partnership Opportunities', icon: Handshake, color: 'orange' },
    { href: '/contact', label: 'Contact', icon: MessageSquare, color: 'teal' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-md">
      <div className="container flex h-16 xl:h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <Image 
            src={siteConfig.logo} 
            alt={siteConfig.name}
            width={64}
            height={64}
            className="h-12 xl:h-16 w-auto transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Desktop Navigation - Only show on xl (1280px+) */}
        <nav className="hidden xl:flex items-center space-x-4 text-sm font-bold">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="transition-colors hover:text-pink-600 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button - Only show on xl */}
        <div className="hidden xl:flex items-center flex-shrink-0">
          <Button asChild className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-full px-4 text-sm shadow-lg">
            <Link href="/testimonials">
              <Star className="mr-1.5 h-4 w-4" />
              Share Experience
            </Link>
          </Button>
        </div>

        {/* Mobile/Tablet Menu Button - Show on screens smaller than xl */}
        <button
          className="xl:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-7 w-7 text-pink-600" /> : <Menu className="h-7 w-7 text-pink-600" />}
        </button>
      </div>

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t bg-white shadow-lg">
          <nav className="container py-4 space-y-2">
            {mobileNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center gap-3 py-3 text-base font-bold transition-colors hover:text-pink-600 border-l-4 border-transparent hover:border-pink-600 pl-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg">
                <Link href="/testimonials" onClick={() => setMobileMenuOpen(false)}>
                  <Star className="mr-2 h-4 w-4" />
                  Share Your Experience
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
