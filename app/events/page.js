'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Filter, Search, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { format } from 'date-fns';

// Helper function to generate excerpt from description
// Strips emojis and HTML, returns first 150 chars + "..."
function generateExcerpt(description, maxLength = 150) {
  if (!description) return '';
  
  // Strip HTML tags
  let text = description.replace(/<[^>]*>/g, '');
  
  // Strip emojis (unicode emoji ranges)
  text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols Extended-A
    .replace(/[\u{231A}-\u{231B}]/gu, '') // Watch, Hourglass
    .replace(/[\u{23E9}-\u{23F3}]/gu, '') // Media control
    .replace(/[\u{23F8}-\u{23FA}]/gu, '') // Media control
    .replace(/[\u{25AA}-\u{25AB}]/gu, '') // Squares
    .replace(/[\u{25B6}]/gu, '') // Play button
    .replace(/[\u{25C0}]/gu, '') // Reverse button
    .replace(/[\u{25FB}-\u{25FE}]/gu, '') // Squares
    .replace(/[\u{2614}-\u{2615}]/gu, '') // Umbrella, Hot beverage
    .replace(/[\u{2648}-\u{2653}]/gu, '') // Zodiac
    .replace(/[\u{267F}]/gu, '') // Wheelchair
    .replace(/[\u{2693}]/gu, '') // Anchor
    .replace(/[\u{26A1}]/gu, '') // High voltage
    .replace(/[\u{26AA}-\u{26AB}]/gu, '') // Circles
    .replace(/[\u{26BD}-\u{26BE}]/gu, '') // Sports
    .replace(/[\u{26C4}-\u{26C5}]/gu, '') // Weather
    .replace(/[\u{26CE}]/gu, '') // Ophiuchus
    .replace(/[\u{26D4}]/gu, '') // No entry
    .replace(/[\u{26EA}]/gu, '') // Church
    .replace(/[\u{26F2}-\u{26F3}]/gu, '') // Fountain, Golf
    .replace(/[\u{26F5}]/gu, '') // Sailboat
    .replace(/[\u{26FA}]/gu, '') // Tent
    .replace(/[\u{26FD}]/gu, '') // Fuel pump
    .replace(/[\u{2702}]/gu, '') // Scissors
    .replace(/[\u{2705}]/gu, '') // Check mark
    .replace(/[\u{2708}-\u{270D}]/gu, '') // Airplane to Writing hand
    .replace(/[\u{270F}]/gu, '') // Pencil
    .replace(/[\u{2712}]/gu, '') // Black nib
    .replace(/[\u{2714}]/gu, '') // Check mark
    .replace(/[\u{2716}]/gu, '') // X mark
    .replace(/[\u{271D}]/gu, '') // Latin cross
    .replace(/[\u{2721}]/gu, '') // Star of David
    .replace(/[\u{2728}]/gu, '') // Sparkles
    .replace(/[\u{2733}-\u{2734}]/gu, '') // Eight spoked asterisk
    .replace(/[\u{2744}]/gu, '') // Snowflake
    .replace(/[\u{2747}]/gu, '') // Sparkle
    .replace(/[\u{274C}]/gu, '') // Cross mark
    .replace(/[\u{274E}]/gu, '') // Cross mark
    .replace(/[\u{2753}-\u{2755}]/gu, '') // Question marks
    .replace(/[\u{2757}]/gu, '') // Exclamation mark
    .replace(/[\u{2763}-\u{2764}]/gu, '') // Heart
    .replace(/[\u{2795}-\u{2797}]/gu, '') // Plus, Minus, Division
    .replace(/[\u{27A1}]/gu, '') // Right arrow
    .replace(/[\u{27B0}]/gu, '') // Curly loop
    .replace(/[\u{27BF}]/gu, '') // Double curly loop
    .replace(/[\u{2934}-\u{2935}]/gu, '') // Arrows
    .replace(/[\u{2B05}-\u{2B07}]/gu, '') // Arrows
    .replace(/[\u{2B1B}-\u{2B1C}]/gu, '') // Squares
    .replace(/[\u{2B50}]/gu, '') // Star
    .replace(/[\u{2B55}]/gu, '') // Circle
    .replace(/[\u{3030}]/gu, '') // Wavy dash
    .replace(/[\u{303D}]/gu, '') // Part alternation mark
    .replace(/[\u{3297}]/gu, '') // Circled Ideograph Congratulation
    .replace(/[\u{3299}]/gu, ''); // Circled Ideograph Secret
  
  // Clean up multiple spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate
  if (text.length <= maxLength) return text;
  
  // Cut at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

// Unified Event Card Component with overflow fixes
function UnifiedEventCard({ event, isPast = false }) {
  const eventDate = new Date(event.startDateTime || event.date);
  const hasDesipass = event.desipassUrl || event.ticketPlatforms?.desipassUrl;
  const hasEventbrite = event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl;
  const hasTickets = hasDesipass || hasEventbrite;

  const categoryColors = {
    'Holi': 'from-pink-500 to-purple-500',
    'Bollywood Night': 'from-blue-500 to-purple-500',
    'Garba': 'from-orange-500 to-red-500',
    'Concert': 'from-red-500 to-pink-500',
    'Navratri': 'from-orange-500 to-yellow-500',
    'Cultural': 'from-amber-500 to-orange-500',
    'default': 'from-purple-500 to-pink-500'
  };

  const gradientClass = categoryColors[event.category] || categoryColors.default;
  
  // Use shortSummary if available, otherwise generate excerpt from description
  const cardSummary = event.shortSummary || generateExcerpt(event.description, 160);

  return (
    <Card className={`overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105 transform bg-white ${isPast ? 'opacity-75' : ''}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.coverImagePath || event.poster || event.coverImageUrl || 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800'}
          alt={event.title}
          fill
          className={`object-cover transition-transform hover:scale-110 ${isPast ? 'grayscale-[30%]' : ''}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}/40 to-transparent`} />
        
        {/* Badges Container - Fixed overflow with flex-wrap and max-width */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 overflow-hidden">
          {event.featured && !isPast && (
            <Badge className="bg-yellow-400 text-black font-bold shadow-lg text-xs px-2 py-0.5 flex-shrink-0">
              <Sparkles className="h-3 w-3 mr-1" />
              FEATURED
            </Badge>
          )}
          {isPast && (
            <Badge variant="secondary" className="bg-gray-700 text-white text-xs px-2 py-0.5 flex-shrink-0">
              Past
            </Badge>
          )}
          {/* Ticket platform badges - constrained width */}
          {hasDesipass && (
            <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5 flex-shrink-0 max-w-[100px] truncate">
              DesiPass
            </Badge>
          )}
          {hasEventbrite && (
            <Badge className="bg-orange-600 text-white text-xs px-2 py-0.5 flex-shrink-0 max-w-[100px] truncate">
              Eventbrite
            </Badge>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Badge className={`bg-gradient-to-r ${gradientClass} text-white font-bold text-sm px-4 py-2 shadow-lg`}>
            {event.category || 'Event'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-black text-2xl mb-4 line-clamp-2 text-gray-900">{event.title}</h3>
        <div className="space-y-3 text-base">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex-shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="font-semibold">{format(eventDate, 'EEE, MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <span className="font-semibold">{format(eventDate, 'HH:mm')} Uhr</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-semibold truncate">{event.city}{event.venue ? ` • ${event.venue}` : ''}</span>
          </div>
        </div>
        
        {/* Description Excerpt - derived from event.description */}
        {excerpt && (
          <p className="mt-4 text-gray-600 line-clamp-2 leading-relaxed text-sm">
            {excerpt}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        {/* Ticket Buttons - Responsive: stacked on mobile, row on desktop */}
        {!isPast && hasTickets ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {hasDesipass && (
              <Button asChild className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Link href={event.desipassUrl || event.ticketPlatforms?.desipassUrl} target="_blank" className="truncate">
                  <span className="truncate">DesiPass</span>
                  <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              </Button>
            )}
            {hasEventbrite && (
              <Button asChild className="flex-1 min-w-0 bg-orange-600 hover:bg-orange-700 text-white font-bold">
                <Link href={event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl} target="_blank" className="truncate">
                  <span className="truncate">Eventbrite</span>
                  <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              </Button>
            )}
          </div>
        ) : !isPast ? (
          <Button disabled className="w-full bg-gray-300 text-gray-600">
            Tickets Coming Soon
          </Button>
        ) : null}

        {/* View Details */}
        <Button asChild variant="outline" className="w-full">
          <Link href={`/events/${event.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch classified events from DB (single source of truth)
      const res = await fetch('/api/events?type=classified');
      const data = await res.json();
      
      setUpcomingEvents(data.upcoming || []);
      setPastEvents(data.past || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine all events for filtering
  const allEvents = [...upcomingEvents, ...pastEvents];

  // Get unique cities and categories
  const cities = [...new Set(allEvents.map(e => e.city))].filter(Boolean);
  const categories = [...new Set(allEvents.map(e => e.category))].filter(Boolean);

  // Filter function
  const filterEvents = (events) => {
    return events.filter(event => {
      const matchesCity = selectedCity === 'all' || event.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesCategory && matchesSearch;
    });
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);
  const filteredAll = filterEvents(allEvents);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
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
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-14">
                <TabsTrigger value="upcoming" className="text-lg">
                  Upcoming ({filteredUpcoming.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-lg">
                  Past ({filteredPast.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-lg">
                  All ({filteredAll.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Events */}
              <TabsContent value="upcoming" className="space-y-8">
                {filteredUpcoming.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredUpcoming.map(event => (
                      <UnifiedEventCard key={event.id} event={event} />
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

              {/* Past Events */}
              <TabsContent value="past" className="space-y-8">
                {filteredPast.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPast.map(event => (
                      <UnifiedEventCard key={event.id} event={event} isPast />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-600">No Past Events</h3>
                  </div>
                )}
              </TabsContent>

              {/* All Events */}
              <TabsContent value="all" className="space-y-8">
                {filteredAll.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAll.map(event => (
                      <UnifiedEventCard 
                        key={event.id} 
                        event={event} 
                        isPast={event.classification === 'past'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-600">No Events Found</h3>
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
