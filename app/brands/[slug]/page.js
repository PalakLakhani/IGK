'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import MascotAssistant from '@/components/MascotAssistant';
import EventCard from '@/components/EventCard';
import { getBrandBySlug, brands } from '@/lib/brands-data';

export default function BrandPage() {
  const params = useParams();
  const brand = getBrandBySlug(params.slug);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      fetchBrandEvents();
    }
  }, [brand]);

  const fetchBrandEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      const allEvents = data.events || [];

      // Filter events by brand category
      const brandEvents = brand.categories.includes('All') 
        ? allEvents 
        : allEvents.filter(event => brand.categories.includes(event.category));

      const now = new Date();
      const upcoming = brandEvents.filter(e => new Date(e.date) >= now);
      const past = brandEvents.filter(e => new Date(e.date) < now);

      setFilteredEvents({ upcoming, past });
      setEvents(brandEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Brand Not Found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Gallery images for the brand
  const galleryImages = [
    'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0',
    'https://images.unsplash.com/photo-1585607344893-43a4bd91169a',
    'https://images.unsplash.com/photo-1640966437076-faa93627b354',
    'https://images.unsplash.com/photo-1617173315663-a6f63e72634e',
    'https://images.unsplash.com/photo-1630663129615-a2331ed88ab6',
    'https://images.unsplash.com/photo-1468234847176-28606331216a'
  ];

  // Other brands for cross-promotion
  const otherBrands = brands.filter(b => b.id !== brand.id);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      {/* Brand Hero */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1761503389996-f5157aa070a6"
          alt={brand.name}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${brand.color} opacity-95`} />
        <div className="relative container text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className={`relative w-36 h-36 mx-auto mb-6 ${brand.bgColor || 'bg-white'} rounded-2xl p-4 shadow-2xl`}>
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-4 drop-shadow-2xl">{brand.fullName}</h1>
            <p className="text-2xl md:text-3xl font-semibold mb-8 drop-shadow-lg">{brand.description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-10 py-7 rounded-full shadow-2xl">
                <Link href={brand.instagram} target="_blank">
                  <Instagram className="mr-2 h-6 w-6" />
                  Follow on Instagram
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-gray-900 font-bold text-lg px-10 py-7 rounded-full backdrop-blur">
                <Link href="/events">
                  <Calendar className="mr-2 h-6 w-6" />
                  See All Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Brand */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <Badge className={`bg-gradient-to-r ${brand.color} text-white text-lg px-6 py-2 mb-4`}>
              About Us
            </Badge>
            <h2 className="text-4xl font-black mb-6">About {brand.name}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">{brand.about}</p>
          </div>
          
          {/* Brand Categories */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {brand.categories.map((cat, i) => (
              <Badge key={i} variant="outline" className="text-lg px-4 py-2">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Events */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {brand.name} Events
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({filteredEvents.upcoming.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({filteredEvents.past.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {filteredEvents.upcoming.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.upcoming.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-xl">No upcoming events at the moment.</p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link href="/events">Browse All Events</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {filteredEvents.past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.past.slice(0, 6).map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-xl">No past events to display.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Gallery Highlights */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-6">Gallery Highlights</h2>
            <p className="text-xl text-gray-600">Memorable moments from {brand.name} events</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg group">
                <Image
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/gallery">
                View Full Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Other Brands */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-6">Explore Our Other Brands</h2>
            <p className="text-xl text-gray-600">Discover more amazing events and experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {otherBrands.map((b) => (
              <Card key={b.id} className="overflow-hidden border-2 hover:border-pink-500 transition-all hover:scale-105 group cursor-pointer">
                <Link href={`/brands/${b.slug}`}>
                  <CardContent className="p-6">
                    <div className="relative h-20 mb-4 flex items-center justify-center">
                      <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-10 rounded-lg`} />
                      <div className="relative w-16 h-16">
                        <Image
                          src={b.logo}
                          alt={b.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-center">{b.name}</h3>
                    <p className="text-sm text-gray-600 text-center">{b.description}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Follow CTA */}
      <section className={`relative py-20 overflow-hidden bg-gradient-to-r ${brand.color}`}>
        <div className="relative container text-center text-white">
          <Instagram className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-5xl font-black mb-6 drop-shadow-2xl">Stay Connected</h2>
          <p className="text-2xl mb-10 max-w-2xl mx-auto opacity-95">
            Follow {brand.name} on Instagram for the latest updates, behind-the-scenes content, and exclusive announcements.
          </p>
          <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
            <Link href={brand.instagram} target="_blank">
              <Instagram className="mr-2 h-6 w-6" />
              Follow @{brand.instagram.split('/').pop()}
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <MascotAssistant />
    </div>
  );
}
