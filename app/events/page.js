'use client';

import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EventCard from '@/components/EventCard';
import Image from 'next/image';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, selectedCity, selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const type = activeTab === 'all' ? '' : activeTab;
      const res = await fetch(`/api/events?type=${type}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(event => event.city === selectedCity);
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const cities = ['all', ...new Set(events.map(e => e.city))];
  const categories = ['all', ...new Set(events.map(e => e.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header with Mixed Event Images */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1768054186550-4bdbb8f2640e"
          alt="Events"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 via-pink-600/90 to-orange-500/85" />
        <div className="relative container text-center text-white">
          <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl">All Events</h1>
          <p className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto drop-shadow-lg">Discover amazing cultural experiences happening across Germany</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-white shadow-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-12 flex-1 bg-gradient-to-b from-pink-50 via-white to-purple-50">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <>
                  <div className="mb-6 text-sm text-muted-foreground">
                    Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
