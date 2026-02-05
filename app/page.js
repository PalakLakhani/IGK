'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Shield, Music, Utensils, ArrowRight, CheckCircle, Star, Sparkles, Heart, PartyPopper, Mail, Leaf, Wine, Baby, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EventCard from '@/components/EventCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import OurBrands from '@/components/OurBrands';
import MascotAssistant from '@/components/MascotAssistant';
import StatsBar from '@/components/StatsBar';
import { siteConfig } from '@/config/site';
import { format } from 'date-fns';

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchUpcomingEvents();
    fetchTestimonials();
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

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?limit=6');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
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

  // Updated Event Categories (as per requirements)
  // Images sourced from Unsplash - stored locally for optimization
  // - bollywood-dj-events.jpg: Photo by Unsplash (JErmY3TtMog) - DJ mixing music
  // - trend-led-experiences.jpg: Photo by Unsplash (qHyzRjy0ywU) - people socializing
  // - indian-cultural-events.jpg: Photo by Unsplash (j-s3Xs34xRs) - Diwali celebration
  const eventTypes = [
    {
      title: 'Bollywood DJ Nights & Club Events',
      emoji: '🎧',
      description: 'Dance to the hottest Bollywood beats all night',
      image: '/images/categories/bollywood-dj-events.jpg',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Concerts & Live Performances',
      emoji: '🎤',
      description: 'Experience live music from top artists on stage',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      gradient: 'from-red-600 to-orange-500'
    },
    {
      title: 'Indian Cultural Events',
      emoji: '🌸',
      description: 'Garba, Dandiya, Holi & traditional celebrations',
      image: '/images/categories/indian-cultural-events.jpg',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Weddings & Private Celebrations',
      emoji: '💍',
      description: 'Stunning Indian wedding setups and private events',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Corporate Events & Brand Activations',
      emoji: '🏢',
      description: 'Professional corporate gatherings and activations',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Trend-led Experiences',
      emoji: '🔥',
      description: 'Fake Shaadi, Speed Dating & unique concepts',
      image: '/images/categories/trend-led-experiences.jpg',
      gradient: 'from-amber-500 to-red-500'
    }
  ];

  // Default testimonials if none from API
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: '1',
      name: 'Priya S.',
      city: 'Berlin',
      rating: 5,
      testimonial: "Best Holi celebration I've attended in Germany! The organization was perfect, colors were safe, and the energy was amazing.",
      eventAttended: 'Holi Bash Berlin 2024'
    },
    {
      id: '2',
      name: 'Rahul K.',
      city: 'Munich',
      rating: 5,
      testimonial: "The Bollywood night was incredible! Great music, amazing crowd, and such a fun way to meet new people from the community.",
      eventAttended: 'BIG Bollywood Night'
    },
    {
      id: '3',
      name: 'Anjali M.',
      city: 'Frankfurt',
      rating: 5,
      testimonial: "Felt like home! The Garba night brought back so many memories. Professional setup and family-friendly environment.",
      eventAttended: 'Navaratri Fiesta 2024'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section with Video */}
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
                    <span>{heroEvents[currentSlide]?.date ? format(new Date(heroEvents[currentSlide]?.date), 'MMM dd, yyyy') : ''}</span>
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
                  <Button size="lg" variant="outline" asChild className="text-black bg-white border-2 border-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black font-bold text-lg px-8 py-7 rounded-full shadow-lg">
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
          /* Hero with Video Background */
          <div className="relative h-full w-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={siteConfig.heroVideo?.poster}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={siteConfig.heroVideo?.url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-purple-600/80 to-orange-500/70" />
            <div className="relative container h-full flex items-center justify-center text-white">
              <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
                <h1 className="text-7xl md:text-8xl font-black mb-6 drop-shadow-2xl">Welcome to IGK</h1>
                <p className="text-3xl mb-8 font-semibold">Curated Events & Experiences Across Germany</p>
                <Button size="lg" asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
                  <Link href="/events">
                    <Sparkles className="mr-2 h-6 w-6" />
                    Explore Events
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Stats Banner - Using shared StatsBar component */}
      <StatsBar variant="gradient" showReviewCount={false} />

      {/* Event Categories Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-6 py-2 mb-4">
              Our Events
            </Badge>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Event Categories
            </h2>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
              Curated experiences for every occasion
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
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${type.gradient} opacity-80 group-hover:opacity-90 transition-all`} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-4xl mb-2">{type.emoji}</div>
                    <h3 className="text-2xl font-black mb-2">{type.title}</h3>
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
              Discover curated experiences happening across Germany
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

      {/* Why Attend Section - Updated */}
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
            {/* Authentic Vibes */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800" alt="Live Performance" fill className="object-cover" />
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

            {/* Safe & Organised - Updated Image */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" alt="Professional Event Security" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Safe & Organised</h3>
                <p className="text-green-100">
                  Professional security, entry management, and strict safety protocols
                </p>
              </CardContent>
            </Card>

            {/* Community Connection - Updated Image */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=800" alt="People Networking" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Community Connection</h3>
                <p className="text-blue-100">
                  Meet and network with the vibrant Indian community in Germany
                </p>
              </CardContent>
            </Card>

            {/* Pure Vegetarian Food - Updated */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800" alt="Vegetarian Indian Food" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Leaf className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Pure Vegetarian Food</h3>
                <p className="text-purple-100">
                  100% vegetarian Indian cuisine, street food & traditional delicacies
                </p>
              </CardContent>
            </Card>

            {/* Family Friendly & Non-Alcohol */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800" alt="Family Event" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Baby className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Family-Friendly</h3>
                <p className="text-orange-100">
                  Non-alcohol events with safe, family-friendly environment for all ages
                </p>
              </CardContent>
            </Card>

            {/* Year-Round Events */}
            <Card className="overflow-hidden border-none shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105">
              <div className="relative h-48">
                <Image src="https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800" alt="Seasonal Events" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <h3 className="text-2xl font-bold mb-3">Year-Round Events</h3>
                <p className="text-yellow-100">
                  Regular events celebrating all major Indian festivals and occasions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ticketing Platforms - Updated (Only DesiPass & Eventbrite) */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Your Tickets
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              Choose your preferred ticketing platform - instant digital tickets with QR codes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* DesiPass */}
            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              <CardContent className="pt-10 pb-10 relative">
                <h3 className="text-4xl font-bold mb-6">DesiPass</h3>
                <ul className="space-y-3 text-blue-50 text-lg mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Instant QR code tickets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Multiple payment options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Trusted Indian events platform</span>
                  </li>
                </ul>
                <Button asChild size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold">
                  <Link href="https://desipass.com" target="_blank">
                    Visit DesiPass
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Eventbrite */}
            <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
              <CardContent className="pt-10 pb-10 relative">
                <h3 className="text-4xl font-bold mb-6">Eventbrite</h3>
                <ul className="space-y-3 text-orange-50 text-lg mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Instant QR code tickets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Global reach & recognition</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <span>Buyer protection included</span>
                  </li>
                </ul>
                <Button asChild size="lg" className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">
                  <Link href="https://eventbrite.com" target="_blank">
                    Visit Eventbrite
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
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

      {/* Community CTA - WhatsApp Button Always Visible */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920"
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
            {/* WhatsApp Button - Always Visible */}
            <Button size="lg" asChild className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
              <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                <MessageCircle className="mr-2 h-6 w-6" />
                WhatsApp Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <OurBrands />

      {/* Testimonials - Dynamic */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              What People Say
            </h2>
            <p className="text-2xl text-gray-600 font-medium">Hear from our community</p>
            <Link href="/testimonials" className="inline-flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 font-semibold">
              Share your experience
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayTestimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={testimonial.id || index} className="border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <MascotAssistant />
    </div>
  );
}
