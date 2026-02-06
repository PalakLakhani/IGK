'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Images, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageHero from '@/components/PageHero';

export default function GalleryPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await fetch('/api/gallery/themes');
      const data = await res.json();
      setThemes(data.themes || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
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

      {/* Theme Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 flex-1">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery...</p>
            </div>
          ) : themes.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Browse by Theme</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore our collection of event photos organized by theme
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map((theme) => (
                  <Link key={theme.id} href={`/gallery/${theme.slug}`}>
                    <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
                      {/* Cover Image */}
                      <div className="relative h-56 overflow-hidden">
                        {theme.coverImageUrl ? (
                          <Image
                            src={theme.coverImageUrl}
                            alt={theme.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Images className="h-16 w-16 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Photo count badge */}
                        <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {theme.photoCount || 0} photos
                        </Badge>

                        {/* Theme name overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold text-white mb-1">{theme.name}</h3>
                          {theme.description && (
                            <p className="text-white/80 text-sm line-clamp-2">{theme.description}</p>
                          )}
                        </div>
                      </div>

                      {/* View button */}
                      <CardContent className="p-4 bg-white group-hover:bg-pink-50 transition-colors">
                        <div className="flex items-center justify-between text-pink-600">
                          <span className="font-semibold">View Gallery</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
