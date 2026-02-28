'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { 
  Newspaper, Instagram, Youtube, Globe, ExternalLink, Play, 
  X, Quote, Calendar, Sparkles, Star, ChevronRight, Award,
  TrendingUp, Camera, Video, FileText, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { format, parseISO } from 'date-fns';

// Type icons mapping
const typeIcons = {
  newspaper: Newspaper,
  instagram: Instagram,
  youtube: Youtube,
  online: Globe
};

const typeLabels = {
  newspaper: 'Print Media',
  instagram: 'Instagram',
  youtube: 'YouTube',
  online: 'Online Article'
};

const typeColors = {
  newspaper: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', gradient: 'from-slate-600 to-slate-800' },
  instagram: { bg: 'bg-gradient-to-r from-pink-100 to-purple-100', text: 'text-pink-700', border: 'border-pink-300', gradient: 'from-pink-500 to-purple-600' },
  youtube: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', gradient: 'from-red-500 to-red-700' },
  online: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', gradient: 'from-blue-500 to-cyan-500' }
};

export default function SpotlightPage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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

  // Group media by year and month for timeline
  const groupedByDate = mediaItems.reduce((acc, item) => {
    const date = item.publishedDate ? new Date(item.publishedDate) : new Date();
    const yearMonth = format(date, 'yyyy-MM');
    const year = format(date, 'yyyy');
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][yearMonth]) acc[year][yearMonth] = [];
    acc[year][yearMonth].push(item);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedByDate).sort((a, b) => b - a);

  // Prepare lightbox slides
  const lightboxSlides = mediaItems
    .filter(item => item.coverImage && item.type !== 'youtube')
    .map(item => ({ src: item.coverImage, alt: item.title }));

  const openLightbox = (item) => {
    if (item.type === 'youtube' && item.embedUrl) {
      setSelectedVideo(item);
    } else {
      const index = mediaItems.filter(i => i.coverImage && i.type !== 'youtube').findIndex(i => i.id === item.id);
      if (index >= 0) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    }
  };

  // Stats
  const stats = {
    total: mediaItems.length,
    newspapers: mediaItems.filter(i => i.type === 'newspaper').length,
    instagram: mediaItems.filter(i => i.type === 'instagram').length,
    youtube: mediaItems.filter(i => i.type === 'youtube').length,
    online: mediaItems.filter(i => i.type === 'online').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50" ref={containerRef}>
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1920&q=80"
            alt="Spotlight Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-pink-900/90 to-orange-900/85" />
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
        
        <div className="relative container py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center md:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-8"
            >
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />
              IGK Media Journey
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
            
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 md:mb-6 leading-tight px-4 md:px-0">
              In the{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Spotlight
                </span>
                <motion.span 
                  className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl leading-relaxed mb-6 md:mb-10 px-4 md:px-0 mx-auto md:mx-0">
              Our journey through the eyes of media. From local newspapers to viral social posts — 
              see how IGK events have been making waves across Germany.
            </p>
            
            {/* Quick Stats - Mobile optimized */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-6 px-4 md:px-0">
              {[
                { icon: TrendingUp, value: stats.total, label: 'Media Features' },
                { icon: FileText, value: stats.newspapers, label: 'Print Articles' },
                { icon: Camera, value: stats.instagram, label: 'Instagram' },
                { icon: Video, value: stats.youtube, label: 'Videos' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm px-3 py-2 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-white/20"
                >
                  <stat.icon className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}+</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="container">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              <Calendar className="h-3 w-3 mr-1" />
              Our Media Timeline
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              The Story of Our Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch our journey unfold through media coverage over the years
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
          ) : mediaItems.length === 0 ? (
            <Card className="max-w-lg mx-auto">
              <CardContent className="py-12 text-center">
                <Sparkles className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">Coming Soon</h3>
                <p className="text-gray-400 mt-2">Our media coverage timeline will be updated soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 hidden lg:block" 
                   style={{ transform: 'translateX(-50%)' }} />
              
              {/* Timeline Content */}
              {sortedYears.map((year, yearIndex) => (
                <div key={year} className="mb-16">
                  {/* Year Marker */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative flex justify-center mb-12"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-xl z-10">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        <span className="text-3xl font-black">{year}</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Month Groups */}
                  {Object.entries(groupedByDate[year])
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([yearMonth, items], monthIndex) => {
                      const monthDate = parseISO(`${yearMonth}-01`);
                      const isLeft = monthIndex % 2 === 0;
                      
                      return (
                        <div key={yearMonth} className="relative mb-12">
                          {/* Month Label - Center on mobile, alternating on desktop */}
                          <motion.div
                            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`flex mb-6 lg:mb-0 ${isLeft ? 'lg:justify-end lg:pr-[52%]' : 'lg:justify-start lg:pl-[52%]'} justify-center`}
                          >
                            <div className="bg-white shadow-lg px-6 py-2 rounded-full border-2 border-gray-100">
                              <span className="font-bold text-gray-700">{format(monthDate, 'MMMM')}</span>
                            </div>
                          </motion.div>
                          
                          {/* Timeline Node */}
                          <div className="absolute left-1/2 top-0 w-5 h-5 bg-white border-4 border-purple-500 rounded-full hidden lg:block"
                               style={{ transform: 'translate(-50%, 8px)' }} />
                          
                          {/* Media Cards */}
                          <div className={`lg:w-[45%] ${isLeft ? 'lg:mr-auto lg:pr-8' : 'lg:ml-auto lg:pl-8'}`}>
                            <div className="space-y-4">
                              {items.map((item, itemIndex) => {
                                const TypeIcon = typeIcons[item.type] || Globe;
                                const colors = typeColors[item.type] || typeColors.online;
                                
                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: itemIndex * 0.1 }}
                                  >
                                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-200">
                                      {/* Card Header with Cover Image */}
                                      {item.coverImage && (
                                        <div 
                                          className="relative h-48 cursor-pointer overflow-hidden"
                                          onClick={() => openLightbox(item)}
                                        >
                                          <Image
                                            src={item.coverImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                          />
                                          <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                                          
                                          {/* Play button for YouTube */}
                                          {item.type === 'youtube' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                                <Play className="h-8 w-8 text-white ml-1" fill="white" />
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Type Badge */}
                                          <Badge className={`absolute top-3 left-3 ${colors.bg} ${colors.text} border ${colors.border}`}>
                                            <TypeIcon className="h-3 w-3 mr-1" />
                                            {typeLabels[item.type]}
                                          </Badge>
                                          
                                          {/* Date Badge */}
                                          <Badge className="absolute top-3 right-3 bg-black/50 text-white border-0">
                                            {item.publishedDate ? format(new Date(item.publishedDate), 'MMM d, yyyy') : 'Recent'}
                                          </Badge>
                                        </div>
                                      )}
                                      
                                      <CardContent className="p-5">
                                        {/* Publication Info */}
                                        <div className="flex items-center gap-3 mb-3">
                                          {item.publicationLogo ? (
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-gray-200">
                                              <img src={item.publicationLogo} alt="" className="w-full h-full object-cover" />
                                            </div>
                                          ) : (
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                                              <TypeIcon className="h-5 w-5 text-white" />
                                            </div>
                                          )}
                                          <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{item.publicationName}</p>
                                            <p className="text-xs text-gray-500">{typeLabels[item.type]}</p>
                                          </div>
                                        </div>
                                        
                                        {/* Title */}
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                          {item.title}
                                        </h3>
                                        
                                        {/* Description */}
                                        {item.description && (
                                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
                                        )}
                                        
                                        {/* Quote */}
                                        {item.quote && (
                                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border-l-4 border-purple-400">
                                            <Quote className="h-4 w-4 text-purple-400 mb-2" />
                                            <p className="text-sm text-gray-700 italic">{item.quote}</p>
                                          </div>
                                        )}
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                          {item.articleUrl && (
                                            <Button 
                                              asChild 
                                              size="sm" 
                                              className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                                            >
                                              <a href={item.articleUrl} target="_blank" rel="noopener noreferrer">
                                                {item.type === 'youtube' ? (
                                                  <>
                                                    <Play className="h-3 w-3 mr-1" />
                                                    Watch Video
                                                  </>
                                                ) : item.type === 'instagram' ? (
                                                  <>
                                                    <Instagram className="h-3 w-3 mr-1" />
                                                    View Post
                                                  </>
                                                ) : (
                                                  <>
                                                    <ExternalLink className="h-3 w-3 mr-1" />
                                                    Read Article
                                                  </>
                                                )}
                                              </a>
                                            </Button>
                                          )}
                                          
                                          {item.type === 'youtube' && item.embedUrl && (
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => setSelectedVideo(item)}
                                              className="border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                              <Play className="h-3 w-3 mr-1" />
                                              Quick Play
                                            </Button>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-800 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">Want to Feature Our Events?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Are you a journalist, blogger, or content creator? We'd love to collaborate with you and share our story!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full px-8">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold rounded-full px-8">
                <Link href="/partner">
                  Become a Partner
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="h-8 w-8" />
              </button>
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
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
