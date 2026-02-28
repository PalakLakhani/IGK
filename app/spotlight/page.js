'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { 
  Newspaper, Instagram, Youtube, Globe, ExternalLink, Play, 
  X, Quote, Calendar, Filter, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { format } from 'date-fns';

// Type icons mapping
const typeIcons = {
  newspaper: Newspaper,
  instagram: Instagram,
  youtube: Youtube,
  online: Globe
};

// Type colors mapping
const typeColors = {
  newspaper: 'from-gray-700 to-gray-900',
  instagram: 'from-pink-500 to-purple-600',
  youtube: 'from-red-500 to-red-700',
  online: 'from-blue-500 to-cyan-500'
};

const typeBadgeColors = {
  newspaper: 'bg-gray-100 text-gray-800',
  instagram: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
  youtube: 'bg-red-500 text-white',
  online: 'bg-blue-500 text-white'
};

export default function PressPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaItems(data.media || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter media items
  const filteredItems = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeFilter);

  // Prepare lightbox slides (only for images)
  const lightboxSlides = filteredItems
    .filter(item => item.type !== 'youtube')
    .map(item => ({
      src: item.coverImage,
      alt: item.title
    }));

  const openLightbox = (item, index) => {
    if (item.type === 'youtube' && item.embedUrl) {
      setSelectedItem(item);
      setShowVideoModal(true);
    } else {
      // Find the correct index in filtered non-youtube items
      const nonYoutubeItems = filteredItems.filter(i => i.type !== 'youtube');
      const actualIndex = nonYoutubeItems.findIndex(i => i.id === item.id);
      setLightboxIndex(actualIndex >= 0 ? actualIndex : 0);
      setLightboxOpen(true);
    }
  };

  // Masonry breakpoints
  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  const filters = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'newspaper', label: 'Print Media', icon: Newspaper },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'online', label: 'Online', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
        
        <div className="relative container text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-6 py-2">
              <Newspaper className="h-5 w-5 mr-2" />
              Press & Media
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl">
              In The Spotlight
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              See how our events have been featured in newspapers, social media, and video channels across Germany
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b shadow-sm">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full transition-all duration-300 ${
                    activeFilter === filter.id 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.label}
                  {activeFilter === filter.id && (
                    <Badge className="ml-2 bg-white/20 text-white text-xs">
                      {filter.id === 'all' ? mediaItems.length : mediaItems.filter(i => i.type === filter.id).length}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Media Wall */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-80" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-400">No media coverage yet</h3>
              <p className="text-gray-400 mt-2">Check back soon for updates!</p>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-6 w-auto"
              columnClassName="pl-6 bg-clip-padding"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => {
                  const TypeIcon = typeIcons[item.type] || Globe;
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="mb-6"
                    >
                      <Card 
                        className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white rounded-2xl"
                        onClick={() => openLightbox(item, index)}
                      >
                        {/* Image Container */}
                        <div className={`relative overflow-hidden ${
                          item.type === 'youtube' ? 'aspect-video' : 
                          item.type === 'instagram' ? 'aspect-square' : 
                          'aspect-[4/3]'
                        }`}>
                          <Image
                            src={item.coverImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${typeColors[item.type]} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                          
                          {/* Play Button for YouTube */}
                          {item.type === 'youtube' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <Play className="h-10 w-10 text-white ml-1" fill="white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Type Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className={`${typeBadgeColors[item.type]} shadow-lg`}>
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {item.type === 'newspaper' ? 'Print' : 
                               item.type === 'instagram' ? 'Instagram' :
                               item.type === 'youtube' ? 'YouTube' : 'Online'}
                            </Badge>
                          </div>
                          
                          {/* Hover Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <p className="text-white text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {item.publishedDate ? format(new Date(item.publishedDate), 'MMM d, yyyy') : 'Recent'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <CardContent className="p-5">
                          {/* Publication Info */}
                          <div className="flex items-center gap-3 mb-3">
                            {item.publicationLogo ? (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={item.publicationLogo}
                                  alt={item.publicationName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center flex-shrink-0`}>
                                <TypeIcon className="h-5 w-5 text-white" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{item.publicationName}</p>
                              <p className="text-xs text-gray-500">
                                {item.publishedDate ? format(new Date(item.publishedDate), 'MMMM yyyy') : ''}
                              </p>
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {item.title}
                          </h3>
                          
                          {/* Description */}
                          {item.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          
                          {/* Quote */}
                          {item.quote && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3">
                              <Quote className="h-4 w-4 text-purple-400 mb-1" />
                              <p className="text-sm text-gray-700 italic line-clamp-2">{item.quote}</p>
                            </div>
                          )}
                          
                          {/* CTA */}
                          {item.articleUrl && (
                            <Link 
                              href={item.articleUrl} 
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors group/link"
                            >
                              {item.type === 'youtube' ? 'Watch Video' : 
                               item.type === 'instagram' ? 'View Post' : 'Read Article'}
                              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Masonry>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">
                {mediaItems.filter(i => i.type === 'newspaper').length}+
              </div>
              <p className="text-white/80">Print Features</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">
                {mediaItems.filter(i => i.type === 'instagram').length}+
              </div>
              <p className="text-white/80">Social Media</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">
                {mediaItems.filter(i => i.type === 'youtube').length}+
              </div>
              <p className="text-white/80">Video Features</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">
                {mediaItems.filter(i => i.type === 'online').length}+
              </div>
              <p className="text-white/80">Online Articles</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to Feature Our Events?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Are you a journalist, blogger, or content creator? We'd love to collaborate with you!
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 rounded-full px-8">
            <Link href="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Lightbox for images */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <iframe
                src={selectedItem.embedUrl}
                title={selectedItem.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
