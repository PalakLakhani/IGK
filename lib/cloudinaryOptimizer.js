/**
 * Cloudinary Image URL Optimizer
 * 
 * This utility optimizes Cloudinary URLs by adding transformation parameters
 * to reduce bandwidth usage by 60-80% (especially for PNGs!)
 */

/**
 * Optimize a Cloudinary URL with automatic format and quality
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Max width (default: 800)
 * @param {string} options.quality - Quality (default: auto:good)
 * @param {boolean} options.forceWebp - Force WebP format (default: true)
 * @returns {string} - Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;
  
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if already has our optimization transforms
  if (url.includes('/f_auto') || url.includes('/f_webp')) return url;
  
  const { 
    width = 800, 
    quality = 'auto:good',
    forceWebp = true  // Force WebP for massive PNG savings
  } = options;
  
  // Build transformation string
  // f_webp forces WebP format - converts PNGs to WebP (70-80% smaller!)
  // f_auto lets Cloudinary choose best format
  const format = forceWebp ? 'f_webp' : 'f_auto';
  const transforms = `${format},q_${quality},w_${width}`;
  
  // Insert transformation after /upload/
  const optimizedUrl = url.replace(
    '/upload/',
    `/upload/${transforms}/`
  );
  
  return optimizedUrl;
}

/**
 * Force convert PNG URLs to WebP
 * Use this specifically for PNG images to get maximum savings
 */
export function convertPngToWebp(url, maxWidth = 800) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if already optimized
  if (url.includes('/f_webp') || url.includes('/f_auto')) return url;
  
  // Force WebP conversion with good quality
  const transforms = `f_webp,q_auto:good,w_${maxWidth}`;
  
  return url.replace('/upload/', `/upload/${transforms}/`);
}

/**
 * Get optimized URL for different use cases
 * All presets now force WebP to save bandwidth on PNGs
 */
export const cloudinaryPresets = {
  // For thumbnails (small images)
  thumbnail: (url) => optimizeCloudinaryUrl(url, { width: 200, quality: 'auto:low', forceWebp: true }),
  
  // For cards and list items
  card: (url) => optimizeCloudinaryUrl(url, { width: 400, quality: 'auto:good', forceWebp: true }),
  
  // For standard display
  standard: (url) => optimizeCloudinaryUrl(url, { width: 800, quality: 'auto:good', forceWebp: true }),
  
  // For hero/banner images
  hero: (url) => optimizeCloudinaryUrl(url, { width: 1200, quality: 'auto:good', forceWebp: true }),
  
  // For full-size gallery view
  full: (url) => optimizeCloudinaryUrl(url, { width: 1600, quality: 'auto:best', forceWebp: true }),
  
  // For team member photos (usually PNGs with transparency)
  avatar: (url) => optimizeCloudinaryUrl(url, { width: 300, quality: 'auto:good', forceWebp: true }),
  
  // For brand logos (often PNGs)
  logo: (url) => optimizeCloudinaryUrl(url, { width: 200, quality: 'auto:good', forceWebp: true }),
};

export default optimizeCloudinaryUrl;
