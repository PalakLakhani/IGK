'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: false, // We don't use marketing cookies
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    // Disable Umami if user declines analytics
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.disabled = true;
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Main Banner */}
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              {/* Cookie Icon */}
              <div className="hidden sm:flex h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center flex-shrink-0">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="h-5 w-5 text-amber-500 sm:hidden" />
                  <h3 className="font-bold text-lg text-gray-900">We Value Your Privacy</h3>
                </div>
                
                <p className="text-gray-600 text-sm md:text-base mb-4">
                  We use cookies to enhance your browsing experience and analyze site traffic. 
                  Our analytics are privacy-focused and don't track you across websites.
                  {' '}
                  <Link href="/datenschutz" className="text-teal-600 hover:underline font-medium">
                    Learn more
                  </Link>
                </p>
                
                {/* Expandable Details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showDetails ? 'Hide details' : 'Show cookie details'}
                </button>
                
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                        {/* Essential Cookies */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <Shield className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">Essential</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Always Active</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Required for the website to function. These include session management and your cookie preferences.
                            </p>
                          </div>
                        </div>
                        
                        {/* Analytics Cookies */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 3v18h18" />
                              <path d="M18 9l-5 5-4-4-3 3" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">Analytics</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Privacy-Focused</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              We use Umami Analytics - a privacy-friendly, cookieless analytics tool that doesn't collect personal data or track you across sites.
                            </p>
                          </div>
                        </div>
                        
                        {/* Third-Party */}
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <svg className="h-5 w-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 9h6v6H9z" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">Third-Party Services</span>
                            <p className="text-sm text-gray-600">
                              Google Fonts for typography. These may set cookies according to their own policies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={acceptEssentialOnly}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Essential Only
                  </Button>
                  <Link href="/datenschutz" className="hidden sm:inline-flex">
                    <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                      Privacy Policy
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Close Button (just hides, doesn't accept) */}
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
                aria-label="Close temporarily"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
