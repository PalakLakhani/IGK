/**
 * Cloudinary Image URL Optimizer
 * 
 * This utility optimizes Cloudinary URLs by adding transformation parameters
 * to reduce bandwidth usage by 40-60%
 */

/**
 * Optimize a Cloudinary URL with automatic format and quality
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Max width (default: 800)
 * @param {number} options.quality - Quality (default: auto)
 * @returns {string} - Optimized URL
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;
  
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Check if already optimized (has transformation params)
  if (url.includes('/f_auto') || url.includes('/q_auto')) return url;
  
  const { width = 800, quality = 'auto' } = options;
  
  // Build transformation string
  const transforms = `f_auto,q_${quality},w_${width}`;
  
  // Insert transformation after /upload/
  const optimizedUrl = url.replace(
    '/upload/',
    `/upload/${transforms}/`
  );
  
  return optimizedUrl;
}

/**
 * Get optimized URL for different use cases
 */
export const cloudinaryPresets = {
  // For thumbnails (small images)
  thumbnail: (url) => optimizeCloudinaryUrl(url, { width: 200, quality: 'auto:low' }),
  
  // For cards and list items
  card: (url) => optimizeCloudinaryUrl(url, { width: 400, quality: 'auto:good' }),
  
  // For standard display
  standard: (url) => optimizeCloudinaryUrl(url, { width: 800, quality: 'auto:good' }),
  
  // For hero/banner images
  hero: (url) => optimizeCloudinaryUrl(url, { width: 1200, quality: 'auto:good' }),
  
  // For full-size gallery view
  full: (url) => optimizeCloudinaryUrl(url, { width: 1600, quality: 'auto:best' }),
};

export default optimizeCloudinaryUrl;
