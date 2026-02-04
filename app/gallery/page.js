'use client';

import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Image from 'next/image';

export default function GalleryPage() {
  // Sample gallery data
  const galleries = [
    {
      id: 1,
      title: 'Holi Festival Berlin 2024',
      date: 'March 2024',
      city: 'Berlin',
      coverImage: 'https://images.unsplash.com/photo-1583241800698-e8f1a4c64e1e?w=800&h=600&fit=crop',
      imageCount: 45
    },
    {
      id: 2,
      title: 'Bollywood Night Munich',
      date: 'April 2024',
      city: 'Munich',
      coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      imageCount: 32
    },
    {
      id: 3,
      title: 'Garba Night Frankfurt',
      date: 'October 2024',
      city: 'Frankfurt',
      coverImage: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&h=600&fit=crop',
      imageCount: 38
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-pink-900 to-pink-700 text-white">
        <div className="container">
          <Camera className="h-12 w-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Gallery</h1>
          <p className="text-xl max-w-2xl">
            Relive the memories from our amazing events. Browse through photos and videos from past celebrations.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map(gallery => (
              <Card key={gallery.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={gallery.coverImage}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="mb-2">{gallery.city}</Badge>
                    <h3 className="font-bold text-lg">{gallery.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{gallery.date}</span>
                    <span>{gallery.imageCount} photos</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Message */}
          <Card className="mt-12 bg-muted/40">
            <CardContent className="p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">More Galleries Coming Soon</h3>
              <p className="text-muted-foreground">
                We're constantly adding new photos and videos from our events. Follow us on Instagram for the latest updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
