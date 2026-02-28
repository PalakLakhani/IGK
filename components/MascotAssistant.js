'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Calendar, Phone, Users, Mail, Ticket, Instagram, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';

// Cute Indo-German mascot SVG
const MascotCharacter = ({ className, isWaving = false }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Body - Traditional outfit inspired */}
    <ellipse cx="50" cy="70" rx="25" ry="20" fill="#FF6B35" />
    <ellipse cx="50" cy="70" rx="22" ry="17" fill="#FFB347" />
    
    {/* Head */}
    <circle cx="50" cy="38" r="22" fill="#FFDAB9" />
    
    {/* Hair - Black */}
    <ellipse cx="50" cy="25" rx="20" ry="12" fill="#1a1a1a" />
    <ellipse cx="35" cy="32" rx="5" ry="8" fill="#1a1a1a" />
    <ellipse cx="65" cy="32" rx="5" ry="8" fill="#1a1a1a" />
    
    {/* Eyes - Big and cute */}
    <ellipse cx="42" cy="38" rx="5" ry="6" fill="white" />
    <ellipse cx="58" cy="38" rx="5" ry="6" fill="white" />
    <circle cx="43" cy="39" r="3" fill="#2D1810" />
    <circle cx="59" cy="39" r="3" fill="#2D1810" />
    <circle cx="44" cy="38" r="1" fill="white" />
    <circle cx="60" cy="38" r="1" fill="white" />
    
    {/* Rosy cheeks */}
    <circle cx="35" cy="44" r="4" fill="#FFB6C1" opacity="0.6" />
    <circle cx="65" cy="44" r="4" fill="#FFB6C1" opacity="0.6" />
    
    {/* Smile */}
    <path d="M 42 48 Q 50 55 58 48" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Bindi (optional cultural touch) */}
    <circle cx="50" cy="28" r="2" fill="#E31C23" />
    
    {/* Waving hand */}
    <motion.g
      animate={isWaving ? { rotate: [0, 20, -10, 20, 0] } : {}}
      transition={{ duration: 1, repeat: isWaving ? Infinity : 0, repeatDelay: 2 }}
      style={{ transformOrigin: '80px 55px' }}
    >
      <ellipse cx="80" cy="55" rx="8" ry="6" fill="#FFDAB9" />
      {/* Fingers */}
      <ellipse cx="85" cy="50" rx="2" ry="4" fill="#FFDAB9" />
      <ellipse cx="88" cy="53" rx="2" ry="4" fill="#FFDAB9" />
      <ellipse cx="89" cy="57" rx="2" ry="4" fill="#FFDAB9" />
    </motion.g>
    
    {/* German flag colors accent on outfit */}
    <rect x="30" y="62" width="40" height="3" fill="#000000" rx="1" />
    <rect x="30" y="65" width="40" height="3" fill="#DD0000" rx="1" />
    <rect x="30" y="68" width="40" height="3" fill="#FFCC00" rx="1" />
    
    {/* Sparkles around head for AI feel */}
    <motion.circle
      cx="25" cy="25"
      r="2"
      fill="#FFD700"
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="75" cy="20"
      r="2"
      fill="#FF69B4"
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
    <motion.circle
      cx="80" cy="35"
      r="1.5"
      fill="#00BFFF"
      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    />
  </svg>
);

export default function MascotAssistant() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [hasClosedBubble, setHasClosedBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const closed = localStorage.getItem('mascot-bubble-closed');
    if (closed) {
      setHasClosedBubble(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const closeBubble = () => {
    setShowBubble(false);
    setHasClosedBubble(true);
    localStorage.setItem('mascot-bubble-closed', 'true');
  };

  const getContextualContent = () => {
    if (pathname === '/' || pathname.startsWith('/events')) {
      return {
        greeting: 'Namaste! 🙏',
        message: 'Looking for upcoming events? I can help you find the perfect celebration!',
        actions: [
          { label: 'See Events', href: '/events', icon: Calendar },
          { label: 'Buy Tickets', href: '/events', icon: Ticket },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/community')) {
      return {
        greeting: 'Willkommen! 👋',
        message: 'Connect with thousands of Indian expats across Germany!',
        actions: [
          { label: 'Join Groups', href: '/community', icon: Users },
          { label: 'Follow Us', href: siteConfig.social.instagram, icon: Instagram, external: true },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/contact')) {
      return {
        greeting: 'Hello! 💬',
        message: 'Have questions? I am here to help you!',
        actions: [
          { label: 'Email Us', href: `mailto:${siteConfig.contact.email}`, icon: Mail, external: true },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/partner')) {
      return {
        greeting: 'Guten Tag! 🤝',
        message: 'Interested in partnering with us? Let us discuss!',
        actions: [
          { label: 'Get Quote', href: '/contact', icon: Mail },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }

    return {
      greeting: 'Namaste! 🙏',
      message: 'Welcome to IGK! How can I help you today?',
      actions: [
        { label: 'See Events', href: '/events', icon: Calendar },
        { label: 'Contact Us', href: '/contact', icon: Phone }
      ]
    };
  };

  const content = getContextualContent();

  const faqs = [
    { q: 'How do I buy tickets?', a: 'You can purchase tickets directly on our website, or through DesiPass and Eventbrite.' },
    { q: 'Are tickets refundable?', a: 'Tickets are non-refundable but transferable. Check our refund policy for details.' },
    { q: 'What cities do you cover?', a: 'We organize events in Berlin, Munich, Frankfurt, Leipzig, Hamburg, Cologne, and more.' },
    { q: 'Can I join your team?', a: 'Yes! Visit our Team page or contact us to learn about opportunities.' },
    { q: 'How do I partner with you?', a: 'Visit our Partnership Opportunities page and fill out the inquiry form.' }
  ];

  return (
    <>
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <div className="relative">
          {/* Speech Bubble with AI Chat feel */}
          <AnimatePresence>
            {showBubble && !hasClosedBubble && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-24 right-0 w-72 sm:w-80"
              >
                <Card className="p-4 shadow-2xl border-2 border-teal-100 bg-white/95 backdrop-blur-sm">
                  {/* Close button */}
                  <button
                    onClick={closeBubble}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* AI Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-cyan-100 px-2.5 py-1 rounded-full">
                      <Sparkles className="h-3 w-3 text-teal-500" />
                      <span className="text-xs font-semibold text-teal-700">IGK Assistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl rounded-bl-none p-3 mb-3">
                    <p className="text-sm font-bold text-teal-700 mb-1">{content.greeting}</p>
                    <p className="text-sm text-gray-700">{content.message}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {content.actions.map((action, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full justify-between text-left group hover:border-teal-300 hover:bg-teal-50"
                      >
                        <Link href={action.href} target={action.external ? '_blank' : undefined}>
                          <span className="flex items-center gap-2">
                            <action.icon className="h-4 w-4 text-teal-500" />
                            {action.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </Card>
                
                {/* Speech bubble pointer */}
                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r-2 border-b-2 border-teal-100 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot Button with Character */}
          <Sheet>
            <SheetTrigger asChild>
              <motion.button
                className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-2xl flex items-center justify-center overflow-visible group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                aria-label="IGK AI Assistant"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* White circle background for character */}
                <div className="absolute inset-2 rounded-full bg-white shadow-inner"></div>
                
                {/* Character */}
                <div className="relative z-10 w-16 h-16 md:w-20 md:h-20">
                  <MascotCharacter className="w-full h-full" isWaving={isHovered || showBubble} />
                </div>
                
                {/* Message indicator */}
                <motion.div 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="h-3 w-3" />
                </motion.div>
              </motion.button>
            </SheetTrigger>
            
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <MascotCharacter className="w-10 h-10" isWaving={true} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">IGK Assistant</span>
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-normal">Your Indo-German events helper</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-4 border border-teal-100">
                  <p className="text-lg font-bold text-teal-700 mb-1">{content.greeting}</p>
                  <p className="text-gray-700">{content.message}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {content.actions.map((action, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        className="w-full justify-between group hover:border-teal-300 hover:bg-teal-50"
                      >
                        <Link href={action.href} target={action.external ? '_blank' : undefined}>
                          <span className="flex items-center gap-2">
                            <action.icon className="h-4 w-4 text-teal-500" />
                            {action.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-teal-500" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-semibold text-sm mb-1 text-gray-800">{faq.q}</p>
                        <p className="text-sm text-gray-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">Need More Help?</h3>
                  <p className="text-sm text-white/80 mb-4">Our team is always here to assist you!</p>
                  <div className="space-y-2">
                    <Button asChild variant="secondary" className="w-full bg-white text-teal-600 hover:bg-gray-100">
                      <Link href="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white/20">
                      <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                        <Phone className="h-4 w-4 mr-2" />
                        WhatsApp Us
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
