'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasConsent, setHasConsent] = useState(true); // Start as true to avoid flash

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setHasConsent(false);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    setHasConsent(true);
    setShowPopup(false);
  };

  const acceptEssentialOnly = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.disabled = true;
    }
    setHasConsent(true);
    setShowPopup(false);
  };

  // Don't show anything if user has already consented
  if (hasConsent) return null;

  return (
    <>
      {/* Small Cookie Button - Bottom Left */}
      <AnimatePresence>
        {!showPopup && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 1 }}
            onClick={() => setShowPopup(true)}
            className="fixed bottom-4 left-4 z-[100] group"
            aria-label="Cookie settings"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              
              {/* Cookie button */}
              <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cookie className="h-7 w-7 text-white" />
              </div>
              
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute left-16 bottom-1/2 translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Cookie Settings
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Popup when clicked */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">Cookie Settings</h3>
                  <p className="text-white/80 text-sm">Manage your preferences</p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-3">
                <p className="text-gray-600 text-sm">
                  We use privacy-focused analytics (Umami) that don't track you across websites.
                </p>
                
                {/* Cookie Types */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 text-sm">Essential</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Required</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M18 9l-5 5-4-4-3 3" />
                    </svg>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 text-sm">Analytics</span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Privacy-First</span>
                    </div>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={acceptAll}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={acceptEssentialOnly}
                    variant="outline"
                    className="flex-1"
                  >
                    Essential Only
                  </Button>
                </div>
                
                {/* Privacy link */}
                <Link 
                  href="/datenschutz" 
                  className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  Privacy Policy
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
