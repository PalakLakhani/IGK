'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

/**
 * PageHero - Consistent hero section component for all pages
 * 
 * Props:
 * @param {string} title - Main heading (required)
 * @param {string} subtitle - Subtitle text (optional)
 * @param {string} badge - Badge text above title (optional)
 * @param {React.ComponentType} icon - Lucide icon component (optional)
 * @param {string} backgroundImage - URL for background image (optional)
 * @param {string} gradient - Custom gradient overlay (optional, defaults to purple/pink)
 */
export default function PageHero({ 
  title, 
  subtitle, 
  badge, 
  icon: Icon, 
  backgroundImage = 'https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920',
  gradient = 'from-indigo-600/95 via-purple-600/90 to-pink-500/85'
}) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
      
      {/* Content */}
      <div className="relative container text-center text-white">
        {/* Icon */}
        {Icon && (
          <Icon className="h-20 w-20 mx-auto mb-6" />
        )}
        
        {/* Badge */}
        {badge && (
          <Badge className="bg-white/20 backdrop-blur text-white text-lg px-6 py-2 mb-6 inline-block">
            {badge}
          </Badge>
        )}
        
        {/* Title - Matching Team page exactly */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">
          {title}
        </h1>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
