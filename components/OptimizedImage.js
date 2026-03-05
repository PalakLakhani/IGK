'use client';

import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryOptimizer';

/**
 * OptimizedImage - Wrapper around Next.js Image that automatically optimizes Cloudinary URLs
 * 
 * IMPORTANT: This component converts PNGs to WebP format to save 70-80% bandwidth!
 * 
 * Usage:
 * <OptimizedImage src={cloudinaryUrl} alt="..." width={400} height={300} />
 * 
 * This component:
 * 1. Converts PNGs to WebP format - saves 70-80% bandwidth!
 * 2. Adds quality optimization - saves 10-20% bandwidth
 * 3. Adds width limits based on the requested size
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill,
  className,
  priority,
  sizes,
  preset = 'standard', // thumbnail, card, standard, hero, full, avatar, logo
  ...props 
}) {
  // Determine the max width for optimization based on usage or preset
  let maxWidth = width || 800;
  
  if (fill) {
    // For fill images, use larger size based on likely usage
    maxWidth = 1200;
  } else if (preset) {
    // Use preset widths
    const presetWidths = {
      thumbnail: 200,
      card: 400,
      standard: 800,
      hero: 1200,
      full: 1600,
      avatar: 300,
      logo: 200,
    };
    maxWidth = presetWidths[preset] || maxWidth;
  }
  
  // Optimize the URL - this forces WebP conversion for PNGs!
  const optimizedSrc = optimizeCloudinaryUrl(src, { 
    width: maxWidth,
    quality: 'auto:good',
    forceWebp: true  // Convert PNGs to WebP
  });
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt || ''}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      {...props}
    />
  );
}
