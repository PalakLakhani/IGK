'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageHero from '@/components/PageHero';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <PageHero
        icon={ImageIcon}
        title="Gallery"
        subtitle="Relive the magic. Browse through moments captured at our events."
        backgroundImage="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920"
        gradient="from-pink-900/95 via-purple-800/90 to-indigo-700/85"
      />

      {/* Gallery Grid - Masonry Style */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 flex-1">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery...</p>
            </div>
          ) : photos.length > 0 ? (
            <>
              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id || index}
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Gallery photo ${index + 1}`}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
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
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Gallery Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're curating the best moments from our events. Check back soon for photos!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || 'Gallery photo'}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              {selectedPhoto.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                  <p className="text-white text-center">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
