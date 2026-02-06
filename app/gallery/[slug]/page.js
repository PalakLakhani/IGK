'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, ArrowLeft, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function GalleryThemePage() {
  const params = useParams();
  const slug = params.slug;
  
  const [theme, setTheme] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchTheme();
    }
  }, [slug]);

  const fetchTheme = async () => {
    try {
      const res = await fetch(`/api/gallery/themes/${slug}`);
      const data = await res.json();
      
      if (data.theme) {
        setTheme(data.theme);
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Theme Not Found</h1>
            <p className="text-muted-foreground mb-6">This gallery theme doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/gallery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {theme.coverImageUrl ? (
          <Image
            src={theme.coverImageUrl}
            alt={theme.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        <div className="relative container">
          <Link 
            href="/gallery" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
          
          <div className="text-center text-white">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl">
              {theme.name}
            </h1>
            {theme.description && (
              <p className="text-xl sm:text-2xl max-w-3xl mx-auto drop-shadow-lg opacity-90">
                {theme.description}
              </p>
            )}
            <div className="mt-6">
              <span className="inline-flex items-center bg-white/20 backdrop-blur px-4 py-2 rounded-full text-lg">
                <Images className="h-5 w-5 mr-2" />
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid - Masonry Style */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 flex-1">
        <div className="container">
          {photos.length > 0 ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || `${theme.name} photo ${index + 1}`}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-700 mb-2">No Photos Yet</h2>
              <p className="text-muted-foreground">
                Photos for this theme will be added soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && photos.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          <button 
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Next button */}
          <button 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Image */}
          <div 
            className="relative max-w-6xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[currentPhotoIndex].imageUrl}
              alt={photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onContextMenu={(e) => e.preventDefault()} // Disable right-click
            />
            
            {/* Caption */}
            {photos[currentPhotoIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-b-lg">
                <p className="text-white text-center">{photos[currentPhotoIndex].caption}</p>
              </div>
            )}
          </div>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
