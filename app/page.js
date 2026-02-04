'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Shield, Music, Utensils, ArrowRight, CheckCircle, Star, Sparkles, Heart, PartyPopper, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EventCard from '@/components/EventCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { siteConfig } from '@/config/site';
import { format } from 'date-fns';

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const res = await fetch('/api/events?type=upcoming');
      const data = await res.json();
      setUpcomingEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (upcomingEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(upcomingEvents.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [upcomingEvents.length]);

  const heroEvents = upcomingEvents.slice(0, 3);

  // Event Types - Like Zeppelin's Artists Section
  const eventTypes = [
    {
      title: 'Open Air Holi',
      description: 'Celebrate colors in outdoor venues',
      image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      title: 'Bollywood DJ Nights',
      description: 'Dance to the hottest Bollywood beats',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Navratri Garba',
      description: 'Traditional Garba & Dandiya celebrations',
      image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Bhajan Clubbing',
      description: 'Devotional music meets club atmosphere',
      image: 'https://images.unsplash.com/photo-1585607344893-43a4bd91169a',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Diwali Celebrations',
      description: 'Festival of lights spectacular events',
      image: 'https://images.unsplash.com/photo-1640966437076-faa93627b354',
      gradient: 'from-indigo-500 to-pink-500'
    },
    {
      title: 'Cultural Festivals',
      description: 'Authentic Indian cultural experiences',
      image: 'https://images.unsplash.com/photo-1763733594231-57cb22b7e1ad',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Slider - Vibrant and Colorful */}
      <section className="relative h-[700px] overflow-hidden">
        {heroEvents.length > 0 ? (
          <>
            {heroEvents.map((event, index) => (
              <div
                key={event.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={event.poster}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-purple-600/70 to-orange-500/60" />
              </div>
            ))}
            
            <div className="relative container h-full flex items-center">
              <div className="max-w-3xl text-white space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-400 text-black text-base px-5 py-2 font-bold animate-pulse">
                    {heroEvents[currentSlide]?.category}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur text-white text-sm px-4 py-2">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Featured Event
                  </Badge>
                </div>
                <h1 className="text-6xl md:text-7xl font-black leading-tight drop-shadow-2xl">
                  {heroEvents[currentSlide]?.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-xl font-semibold">
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-3 rounded-full">
                    <Calendar className="h-6 w-6" />
                    <span>{format(new Date(heroEvents[currentSlide]?.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur px-5 py-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                    <span>{heroEvents[currentSlide]?.city}</span>
                  </div>
                </div>
                <p className="text-2xl text-white/95 leading-relaxed max-w-2xl">
                  {heroEvents[currentSlide]?.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-7 rounded-full shadow-2xl transform hover:scale-105 transition-all">
                    <Link href={`/events/${heroEvents[currentSlide]?.slug}`}>
                      <PartyPopper className="mr-2 h-6 w-6" />
                      Get Tickets Now
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-white border-2 border-white hover:bg-white hover:text-pink-600 font-bold text-lg px-8 py-7 rounded-full backdrop-blur">
                    <Link href="/events">
                      View All Events
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {heroEvents.length > 1 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                {heroEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-yellow-400 w-12' : 'bg-white/50 w-3'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="relative container h-full flex items-center justify-center text-white">
            <Image
              src="https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=1920&h=1080&fit=crop"
              alt="Colorful celebration"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-purple-600/80 to-orange-500/70" />
            <div className="relative text-center space-y-6 animate-in fade-in zoom-in duration-700">
              <h1 className="text-7xl md:text-8xl font-black mb-6 drop-shadow-2xl">Welcome to {siteConfig.name}</h1>
              <p className="text-3xl mb-8 font-semibold">Premium Indian Cultural Events Across Germany</p>
              <Button size="lg" asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
                <Link href="/events">
                  <Sparkles className="mr-2 h-6 w-6" />
                  Explore Events
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Colorful Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-black">50+</div>
              <div className="text-lg md:text-xl font-semibold opacity-90">Amazing Events</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-black">25K+</div>
              <div className="text-lg md:text-xl font-semibold opacity-90">Happy Attendees</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-black">8</div>
              <div className="text-lg md:text-xl font-semibold opacity-90">Cities</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl md:text-6xl font-black">4.9★</div>
              <div className="text-lg md:text-xl font-semibold opacity-90">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section - Like Zeppelin's Artists */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-6 py-2 mb-4">
              Our Events
            </Badge>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Event Types
            </h2>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
              Experience diverse cultural celebrations throughout the year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventTypes.map((type, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105 group cursor-pointer">
                <div className="relative h-72">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${type.gradient}/80 to-transparent group-hover:${type.gradient}/90 transition-all`} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-3xl font-black mb-2">{type.title}</h3>
                    <p className="text-lg opacity-90">{type.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="bg-pink-500 text-white text-lg px-6 py-2 mb-4">
              <Sparkles className="h-5 w-5 mr-2" />
              Trending Now
            </Badge>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
              Discover amazing cultural experiences happening across Germany
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.slice(0, 6).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {upcomingEvents.length > 6 && (
                <div className="text-center mt-12">
                  <Button size="lg" asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-10 py-7 rounded-full shadow-lg">
                    <Link href="/events">
                      View All Events
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Attend Section - Vibrant with Images */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Why Attend Our Events?
            </h2>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
              Experience the best of Indian culture in Germany
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1630663129615-a2331ed88ab6" alt="Music" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Music className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Authentic Vibes</h3>
                <p className="text-pink-100">
                  Live music, traditional dance, and authentic cultural performances
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1468234847176-28606331216a" alt="Safe" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Safe & Organized</h3>
                <p className="text-green-100">
                  Professional event management with strict safety protocols
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1585607344893-43a4bd91169a" alt="Community" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Community Connection</h3>
                <p className="text-blue-100">
                  Meet and connect with the vibrant Indian community in Germany
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.pexels.com/photos/3452843/pexels-photo-3452843.jpeg" alt="Food" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Utensils className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Delicious Food</h3>
                <p className="text-purple-100">
                  Authentic Indian street food, snacks, and traditional delicacies
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1617173315663-a6f63e72634e" alt="Events" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Year-Round Events</h3>
                <p className="text-orange-100">
                  Regular events celebrating all major Indian festivals and occasions
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1640966437076-faa93627b354" alt="Premium" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Star className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Premium Experience</h3>
                <p className="text-yellow-100">
                  High-quality production, professional staff, and unforgettable memories
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ticketing Platforms - Fixed Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Multiple Ticketing Platforms
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Choose your preferred platform - all provide instant digital tickets with QR codes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              <CardContent className="pt-10 pb-10 relative">
                <div className="text-7xl font-black mb-6 text-white/90">01</div>
                <h3 className="text-3xl font-bold mb-4">Our Website</h3>
                <ul className="space-y-3 text-pink-50 text-lg">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Secure Stripe payment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Instant QR code tickets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Direct email delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              <CardContent className="pt-10 pb-10 relative">
                <div className="text-7xl font-black mb-6 text-white/90">02</div>
                <h3 className="text-3xl font-bold mb-4">DesiPass</h3>
                <ul className="space-y-3 text-blue-50 text-lg">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Instant QR tickets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Multiple payment options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Trusted platform</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              <CardContent className="pt-10 pb-10 relative">
                <div className="text-7xl font-black mb-6 text-white/90">03</div>
                <h3 className="text-3xl font-bold mb-4">Eventbrite</h3>
                <ul className="space-y-3 text-green-50 text-lg">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Instant QR tickets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Global reach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Buyer protection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Mail className="h-16 w-16 mx-auto mb-6 text-pink-500" />
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Never Miss an Event
            </h2>
            <p className="text-2xl text-gray-600 mb-10 font-medium">
              Subscribe to our newsletter for exclusive updates, early bird tickets, and special offers
            </p>
            <NewsletterSubscribe />
            <p className="text-sm text-gray-500 mt-6">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1763733594231-57cb22b7e1ad"
          alt="Community"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 to-pink-600/95" />
        <div className="relative container text-center text-white">
          <Heart className="h-20 w-20 mx-auto mb-8 animate-pulse" />
          <h2 className="text-6xl font-black mb-6 drop-shadow-2xl">Join Our Community</h2>
          <p className="text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Connect with thousands of Indian expats across Germany. Join WhatsApp groups, follow us on social media, and stay updated.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button size="lg" asChild className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
              <Link href="/community">
                <Users className="mr-2 h-6 w-6" />
                Explore Community
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-purple-600 font-bold text-xl px-10 py-8 rounded-full backdrop-blur">
              <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                WhatsApp Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              What People Say
            </h2>
            <p className="text-2xl text-gray-600 font-medium">Hear from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "Best Holi celebration I've attended in Germany! The organization was perfect, colors were safe, and the energy was amazing."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-lg">Priya S.</div>
                    <div className="text-gray-500">Berlin</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "The Bollywood night was incredible! Great music, amazing crowd, and such a fun way to meet new people from the community."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-lg">Rahul K.</div>
                    <div className="text-gray-500">Munich</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "Felt like home! The Garba night brought back so many memories. Professional setup and family-friendly environment."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-lg">Anjali M.</div>
                    <div className="text-gray-500">Frankfurt</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
