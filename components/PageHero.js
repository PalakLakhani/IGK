'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

/**
 * PageHero - Consistent hero section component for all pages
 * Updated to match the "In the Spotlight" design
 * 
 * Props:
 * @param {string} title - Main heading (required)
 * @param {string} subtitle - Subtitle text (optional)
 * @param {string} badge - Badge text above title (optional)
 * @param {React.ComponentType} icon - Lucide icon component (optional)
 * @param {string} backgroundImage - URL for background image (optional)
 * @param {string} gradient - Custom gradient overlay (optional)
 * @param {boolean} showScrollIndicator - Show scroll indicator at bottom (optional)
 * @param {boolean} compact - Use smaller/compact version (optional)
 */
export default function PageHero({ 
  title, 
  subtitle, 
  badge, 
  icon: Icon, 
  backgroundImage = 'https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920',
  gradient = 'from-purple-900/95 via-pink-900/90 to-orange-900/85',
  showScrollIndicator = false,
  compact = false
}) {
  return (
    <section className={`relative ${compact ? 'min-h-[40vh]' : 'min-h-[50vh] md:min-h-[60vh]'} flex items-center overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
      </div>
      
      {/* Floating Elements - Only on non-compact */}
      {!compact && (
        <>
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
        </>
      )}
      
      {/* Content */}
      <div className="relative container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 md:mb-6"
            >
              <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold inline-flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-yellow-400" />}
                {badge}
                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-yellow-400" />
              </Badge>
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
              <Icon className="h-12 w-12 md:h-16 md:w-16 mx-auto text-white/90" />
            </motion.div>
          )}
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-tight px-4">
            <span className="drop-shadow-2xl">{title}</span>
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div 
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 md:h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      )}
    </section>
  );
}
