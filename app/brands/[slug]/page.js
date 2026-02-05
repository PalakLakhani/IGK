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
import { getBrandBySlug } from '@/lib/brands-data';

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
      <div className=\"min-h-screen flex items-center justify-center\">
        <div className=\"text-center\">
          <h1 className=\"text-4xl font-bold mb-4\">Brand Not Found</h1>
          <Button asChild>
            <Link href=\"/\">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50\">
      <Header />

      {/* Brand Hero */}
      <section className=\"relative py-24 overflow-hidden\">
        <Image
          src=\"https://images.unsplash.com/photo-1761503389996-f5157aa070a6\"
          alt={brand.name}
          fill
          className=\"object-cover\"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${brand.color}/95`} />
        <div className=\"relative container text-center text-white\">
          <div className=\"max-w-4xl mx-auto\">
            <div className=\"relative w-32 h-32 mx-auto mb-6 bg-white rounded-2xl p-4 shadow-2xl\">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className=\"object-contain p-2\"
              />
            </div>
            <h1 className=\"text-6xl md:text-7xl font-black mb-4 drop-shadow-2xl\">{brand.fullName}</h1>
            <p className=\"text-2xl md:text-3xl font-semibold mb-8 drop-shadow-lg\">{brand.description}</p>
            <div className=\"flex flex-wrap gap-4 justify-center\">
              <Button size=\"lg\" asChild className=\"bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-10 py-7 rounded-full shadow-2xl\">
                <Link href={brand.instagram} target=\"_blank\">
                  <Instagram className=\"mr-2 h-6 w-6\" />
                  Follow on Instagram
                  <ExternalLink className=\"ml-2 h-5 w-5\" />
                </Link>
              </Button>
              <Button size=\"lg\" asChild variant=\"outline\" className=\"text-white border-2 border-white hover:bg-white hover:text-gray-900 font-bold text-lg px-10 py-7 rounded-full backdrop-blur\">
                <Link href=\"/events\">
                  <Calendar className=\"mr-2 h-6 w-6\" />
                  See All Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Brand */}
      <section className=\"py-20 bg-white\">
        <div className=\"container max-w-4xl\">\n          <div className=\"text-center mb-12\">\n            <h2 className=\"text-4xl font-black mb-6\">About {brand.name}</h2>\n            <p className=\"text-xl text-gray-600 leading-relaxed\">{brand.about}</p>\n          </div>\n        </div>\n      </section>\n\n      {/* Brand Events */}\n      <section className=\"py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50\">\n        <div className=\"container\">\n          <div className=\"text-center mb-12\">\n            <h2 className=\"text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent\">\n              {brand.name} Events\n            </h2>\n          </div>\n\n          {loading ? (\n            <div className=\"text-center py-12\">\n              <div className=\"inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary\"></div>\n            </div>\n          ) : (\n            <Tabs defaultValue=\"upcoming\" className=\"space-y-8\">\n              <TabsList className=\"grid w-full max-w-md mx-auto grid-cols-2\">\n                <TabsTrigger value=\"upcoming\">Upcoming ({filteredEvents.upcoming.length})</TabsTrigger>\n                <TabsTrigger value=\"past\">Past ({filteredEvents.past.length})</TabsTrigger>\n              </TabsList>\n\n              <TabsContent value=\"upcoming\">\n                {filteredEvents.upcoming.length > 0 ? (\n                  <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">\n                    {filteredEvents.upcoming.map(event => (\n                      <EventCard key={event.id} event={event} />\n                    ))}\n                  </div>\n                ) : (\n                  <div className=\"text-center py-12\">\n                    <p className=\"text-gray-500 text-xl\">No upcoming events at the moment.</p>\n                    <Button asChild variant=\"outline\" className=\"mt-4\">\n                      <Link href=\"/events\">Browse All Events</Link>\n                    </Button>\n                  </div>\n                )}\n              </TabsContent>\n\n              <TabsContent value=\"past\">\n                {filteredEvents.past.length > 0 ? (\n                  <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">\n                    {filteredEvents.past.slice(0, 6).map(event => (\n                      <EventCard key={event.id} event={event} />\n                    ))}\n                  </div>\n                ) : (\n                  <div className=\"text-center py-12\">\n                    <p className=\"text-gray-500 text-xl\">No past events to display.</p>\n                  </div>\n                )}\n              </TabsContent>\n            </Tabs>\n          )}\n        </div>\n      </section>\n\n      {/* Gallery Highlights Placeholder */}\n      <section className=\"py-20 bg-white\">\n        <div className=\"container\">\n          <div className=\"text-center mb-12\">\n            <h2 className=\"text-4xl font-black mb-6\">Gallery Highlights</h2>\n            <p className=\"text-xl text-gray-600\">Memorable moments from {brand.name} events</p>\n          </div>\n          <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto\">\n            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (\n              <div key={i} className=\"relative aspect-square overflow-hidden rounded-lg\">\n                <Image\n                  src={`https://images.unsplash.com/photo-${1600000000000 + i * 100000000}`}\n                  alt={`Gallery ${i}`}\n                  fill\n                  className=\"object-cover hover:scale-110 transition-transform\"\n                />\n              </div>\n            ))}\n          </div>\n          <div className=\"text-center mt-8\">\n            <Button asChild size=\"lg\" variant=\"outline\">\n              <Link href=\"/gallery\">\n                View Full Gallery\n                <ArrowRight className=\"ml-2 h-5 w-5\" />\n              </Link>\n            </Button>\n          </div>\n        </div>\n      </section>\n\n      {/* Follow CTA */}\n      <section className={`relative py-20 overflow-hidden bg-gradient-to-r ${brand.color}`}>\n        <div className=\"relative container text-center text-white\">\n          <Instagram className=\"h-16 w-16 mx-auto mb-6\" />\n          <h2 className=\"text-5xl font-black mb-6 drop-shadow-2xl\">Stay Connected</h2>\n          <p className=\"text-2xl mb-10 max-w-2xl mx-auto opacity-95\">\n            Follow {brand.name} on Instagram for the latest updates, behind-the-scenes content, and exclusive announcements.\n          </p>\n          <Button size=\"lg\" asChild className=\"bg-white text-gray-900 hover:bg-gray-100 font-bold text-xl px-10 py-8 rounded-full shadow-2xl\">\n            <Link href={brand.instagram} target=\"_blank\">\n              <Instagram className=\"mr-2 h-6 w-6\" />\n              Follow @{brand.instagram.split('/').pop()}\n            </Link>\n          </Button>\n        </div>\n      </section>\n\n      <Footer />\n      <WhatsAppFloat />\n      <MascotAssistant />\n    </div>\n  );\n}
