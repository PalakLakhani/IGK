'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, HelpCircle, Calendar, Phone, Users, Mail, Ticket, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site';

export default function MascotAssistant() {
  const pathname = usePathname();
  const [showBubble, setShowBubble] = useState(false);
  const [hasClosedBubble, setHasClosedBubble] = useState(false);

  useEffect(() => {
    // Check if user has closed bubble before
    const closed = localStorage.getItem('mascot-bubble-closed');
    if (closed) {
      setHasClosedBubble(true);
      return;
    }

    // Show bubble after 2 seconds on first visit
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
        message: 'Looking for upcoming events? I can help you find the perfect celebration.',
        actions: [
          { label: 'See Events', href: '/events', icon: Calendar },
          { label: 'Buy Tickets', href: '/events', icon: Ticket },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/community')) {
      return {
        message: 'Connect with thousands of Indian expats across Germany.',
        actions: [
          { label: 'Join Groups', href: '/community', icon: Users },
          { label: 'Follow Us', href: siteConfig.social.instagram, icon: Instagram, external: true },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/contact')) {
      return {
        message: 'Have questions? Get in touch with our team.',
        actions: [
          { label: 'Email Us', href: `mailto:${siteConfig.contact.email}`, icon: Mail, external: true },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }
    
    if (pathname.startsWith('/partner')) {
      return {
        message: 'Interested in partnering with us? Let us know.',
        actions: [
          { label: 'Get Quote', href: '/contact', icon: Mail },
          { label: 'WhatsApp', href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`, icon: Phone, external: true }
        ]
      };
    }

    return {
      message: 'Welcome to IGK Events. How can I help you today?',
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
    { q: 'How do I partner with you?', a: 'Visit our Partner page and fill out the inquiry form.' }
  ];

  return (
    <>
      {/* Mascot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Speech Bubble */}
          {showBubble && !hasClosedBubble && (
            <Card className="absolute bottom-20 right-0 w-80 p-4 shadow-2xl animate-in slide-in-from-bottom-5 mb-2">
              <button
                onClick={closeBubble}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              
              <p className="text-sm font-medium mb-4 pr-6">{content.message}</p>
              
              <div className="space-y-2">
                {content.actions.map((action, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Link href={action.href} target={action.external ? '_blank' : undefined}>
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </Card>
          )}

          {/* Mascot Avatar with Help Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-3xl animate-bounce"
                aria-label="IGK Assistant"
              >
                🎭
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-4xl">🎭</span>
                  IGK Assistant
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {content.actions.map((action, index) => (
                      <Button
                        key={index}
                        asChild
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Link href={action.href} target={action.external ? '_blank' : undefined}>
                          <action.icon className="h-4 w-4 mr-2" />
                          {action.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b pb-3">
                        <p className="font-semibold text-sm mb-1">{faq.q}</p>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Need More Help?</h3>
                  <div className="space-y-2">
                    <Button asChild variant="default" className="w-full">
                      <Link href="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
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
