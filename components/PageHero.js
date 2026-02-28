'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

/**
 * PageHero - Consistent hero section component for all pages
 * Matches the "In the Spotlight" design exactly:
 * - Centered on mobile, left-aligned on desktop
 * - Badge on top with icon
 * - Gradient colored keyword with underline animation
 * - Floating animated elements
 * 
 * Props:
 * @param {string} title - Main heading - use | to separate regular text from gradient text (e.g., "About|IGK")
 * @param {string} subtitle - Subtitle text (optional)
 * @param {string} badge - Badge text above title (optional)
 * @param {React.ComponentType} icon - Lucide icon component (optional)
 * @param {string} backgroundImage - URL for background image (optional)
 * @param {string} gradient - Custom gradient overlay (optional)
 */
export default function PageHero({ 
  title, 
  subtitle, 
  badge, 
  icon: Icon, 
  backgroundImage = 'https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920',
  gradient = 'from-purple-900/95 via-pink-900/90 to-orange-900/85'
}) {
  // Split title into regular and gradient parts using |
  const titleParts = title.split('|');
  const regularText = titleParts[0] || '';
  const gradientText = titleParts[1] || '';

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title.replace('|', ' ')}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
      </div>
      
      {/* Floating Elements - Hidden on mobile */}
      <motion.div 
        className="absolute top-10 left-5 md:top-20 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-yellow-400/20 rounded-full blur-xl hidden sm:block"
        animate={{ y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-20 h-20 md:w-32 md:h-32 bg-pink-400/20 rounded-full blur-xl hidden sm:block"
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      
      {/* Content - CENTERED on mobile, LEFT-ALIGNED on desktop (same as Spotlight) */}
      <div className="relative container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center md:text-left"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-8"
            >
              {Icon && <Icon className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />}
              {badge}
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          )}
          
          {/* Icon (if no badge, show icon separately) */}
          {Icon && !badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 md:mb-6"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Icon className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />
              </div>
            </motion.div>
          )}
          
          {/* Title - Same styling as Spotlight */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-tight px-4 md:px-0">
            {regularText && <span className="drop-shadow-2xl">{regularText} </span>}
            {gradientText && (
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  {gradientText}
                </span>
                <motion.span 
                  className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            )}
          </h1>
          
          {/* Subtitle - Same styling as Spotlight */}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl leading-relaxed px-4 md:px-0 mx-auto md:mx-0"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
