'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Newspaper, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AsFeaturedIn() {
  const [featuredMedia, setFeaturedMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMedia();
  }, []);

  const fetchFeaturedMedia = async () => {
    try {
      const res = await fetch('/api/media/featured');
      const data = await res.json();
      setFeaturedMedia(data.media || []);
    } catch (error) {
      console.error('Error fetching featured media:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no featured media
  if (!loading && featuredMedia.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container">
        {/* Header - Matching OurBrands styling */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-6 py-2 mb-4">
              Media Coverage
            </Badge>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              As Featured In
            </h2>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
              Our events have been featured by leading media outlets worldwide
            </p>
          </motion.div>
        </div>

        {/* Logo Carousel/Grid */}
        {loading ? (
          <div className="flex justify-center gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Scrolling animation wrapper */}
            <div className="relative">
              {/* Gradient fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              
              {/* Scrolling logos */}
              <div className="flex overflow-hidden">
                <motion.div 
                  className="flex gap-12 items-center py-6"
                  animate={{ x: [0, -50 * featuredMedia.length] }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: featuredMedia.length * 4,
                      ease: "linear",
                    },
                  }}
                >
                  {/* Duplicate for seamless loop */}
                  {[...featuredMedia, ...featuredMedia, ...featuredMedia].map((item, index) => (
                    <Link
                      key={`${item.id}-${index}`}
                      href="/spotlight"
                      className="flex-shrink-0 group"
                    >
                      <div className="relative flex flex-col items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                        {item.publicationLogo ? (
                          <div className="relative w-24 h-12">
                            <Image
                              src={item.publicationLogo}
                              alt={item.publicationName}
                              fill
                              className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-12 flex items-center justify-center">
                            <Newspaper className="h-8 w-8 text-gray-400 group-hover:text-purple-600 transition-colors" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                          {item.publicationName}
                        </span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button 
            asChild 
            variant="outline" 
            className="rounded-full border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 group"
          >
            <Link href="/spotlight">
              View All Media Coverage
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
