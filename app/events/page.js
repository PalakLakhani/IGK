'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Filter, Search, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EventCard from '@/components/EventCard';
import { format } from 'date-fns';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [desipassEvents, setDesipassEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDesipass, setLoadingDesipass] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
    fetchDesipassEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesipassEvents = async () => {
    try {
      const res = await fetch('/api/desipass/events');
      const data = await res.json();
      setDesipassEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching DesiPass events:', error);
    } finally {
      setLoadingDesipass(false);
    }
  };

  // Get unique cities and categories
  const cities = [...new Set(events.map(e => e.city))].filter(Boolean);
  const categories = [...new Set(events.map(e => e.category))].filter(Boolean);

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesCity = selectedCity === 'all' || event.city === selectedCity;
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  // Split into upcoming and past
  const now = new Date();
  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= now);
  const pastEvents = filteredEvents.filter(e => new Date(e.date) < now);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section - Updated tagline */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920"
          alt="Events"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 to-purple-600/90" />
        <div className="relative container text-center text-white">
          <Badge className="bg-yellow-400 text-black text-lg px-6 py-2 mb-6">
            <Sparkles className="h-5 w-5 mr-2" />
            Curated Events
          </Badge>
          <h1 className="text-6xl font-black mb-6 drop-shadow-2xl">Discover Amazing Events</h1>
          <p className="text-2xl max-w-3xl mx-auto opacity-95">
            Curated events & experiences across Germany - Holi, Bollywood Nights, Garba, Weddings, and more
          </p>
        </div>
      </section>

      {/* DesiPass Featured Events */}
      {desipassEvents.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-white">
                <Badge className="bg-white text-blue-600 text-lg px-4 py-1">
                  Featured on DesiPass
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {desipassEvents.map((event, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <Image
                        src={event.image || 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=400'}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <Badge className="bg-blue-100 text-blue-700 mb-3">DesiPass</Badge>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        {event.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href={event.ticketUrl} target="_blank">
                          Get Tickets on DesiPass
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="container">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[150px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedCity !== 'all' || selectedCategory !== 'all' || searchQuery) && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
                <TabsTrigger value="upcoming" className="text-lg">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-lg">
                  Past Events ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-8">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-600 mb-3">No Upcoming Events</h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery || selectedCity !== 'all' || selectedCategory !== 'all'
                        ? 'No events match your filters. Try adjusting your search.'
                        : 'Check back soon for new events!'}
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSelectedCity('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-8">
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map(event => (
                      <EventCard key={event.id} event={event} variant="past" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-600">No Past Events</h3>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
