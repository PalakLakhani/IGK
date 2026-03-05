'use client';

import Image from 'next/image';
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryOptimizer';

/**
 * OptimizedImage - Wrapper around Next.js Image that automatically optimizes Cloudinary URLs
 * 
 * Usage:
 * <OptimizedImage src={cloudinaryUrl} alt="..." width={400} height={300} />
 * 
 * This component:
 * 1. Automatically adds f_auto (WebP format) to Cloudinary URLs - saves 30-50% bandwidth
 * 2. Automatically adds q_auto (quality optimization) - saves 10-20% bandwidth
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
  ...props 
}) {
  // Determine the max width for optimization based on usage
  const maxWidth = fill ? 1200 : (width || 800);
  
  // Optimize the URL if it's from Cloudinary
  const optimizedSrc = optimizeCloudinaryUrl(src, { 
    width: maxWidth,
    quality: 'auto:good'
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
