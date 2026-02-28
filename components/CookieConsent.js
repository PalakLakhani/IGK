'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookieConsent() {
  const [isExpanded, setIsExpanded] = useState(false);
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
    setIsExpanded(false);
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
    setIsExpanded(false);
  };

  // Don't show anything if user has already consented
  if (hasConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Cute Cookie Icon - Collapsed State */
          <motion.button
            key="cookie-icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.5 }}
            onClick={() => setIsExpanded(true)}
            className="group relative"
            aria-label="Cookie settings"
          >
            {/* Cute Cookie Design */}
            <div className="relative">
              {/* Soft glow */}
              <div className="absolute inset-0 bg-amber-300 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
              
              {/* Cookie body */}
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 shadow-lg flex items-center justify-center group-hover:scale-110 transition-all duration-200 border-2 border-amber-500/50">
                {/* Chocolate chips */}
                <div className="absolute top-2 left-3 h-1.5 w-1.5 rounded-full bg-amber-950" />
                <div className="absolute top-4 right-3 h-2 w-2 rounded-full bg-amber-950" />
                <div className="absolute bottom-3 left-4 h-1.5 w-1.5 rounded-full bg-amber-950" />
                <div className="absolute bottom-2.5 right-4 h-1 w-1 rounded-full bg-amber-950" />
                
                {/* Cookie face - cute eyes */}
                <div className="flex gap-1.5 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-950" />
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-950" />
                </div>
              </div>
              
              {/* Notification badge */}
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            
            {/* Hover tooltip */}
            <div className="absolute left-14 bottom-1/2 translate-y-1/2 bg-amber-900 text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              🍪 Cookie Settings
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-amber-900" />
            </div>
          </motion.button>
        ) : (
          /* Expanded Panel - Small & Compact */
          <motion.div
            key="cookie-panel"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-72 bg-white rounded-xl shadow-2xl overflow-hidden border border-amber-200"
          >
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Cookie className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Cookie Settings</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white p-0.5 hover:bg-white/10 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Compact Content */}
            <div className="p-3 space-y-2.5">
              <p className="text-gray-600 text-xs leading-relaxed">
                We use privacy-focused analytics that respect your data.
              </p>
              
              {/* Minimal Cookie Types */}
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md flex-1">
                  <Shield className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-gray-700">Essential</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md flex-1">
                  <svg className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18" />
                    <path d="M18 9l-5 5-4-4-3 3" />
                  </svg>
                  <span className="text-gray-700">Analytics</span>
                </div>
              </div>
              
              {/* Compact Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-xs h-8"
                >
                  Accept All
                </Button>
                <Button
                  onClick={acceptEssentialOnly}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Essential Only
                </Button>
              </div>
              
              {/* Privacy link */}
              <Link 
                href="/datenschutz" 
                className="flex items-center justify-center gap-0.5 text-xs text-gray-400 hover:text-amber-600 transition-colors"
              >
                Privacy Policy
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
