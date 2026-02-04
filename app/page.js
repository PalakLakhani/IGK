'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Shield, Music, Utensils, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EventCard from '@/components/EventCard';
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

  // Auto-rotate hero slider
  useEffect(() => {
    if (upcomingEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(upcomingEvents.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [upcomingEvents.length]);

  const heroEvents = upcomingEvents.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              </div>
            ))}
            
            <div className="relative container h-full flex items-center">
              <div className="max-w-2xl text-white space-y-6">
                <Badge className="bg-amber-500 text-white text-sm px-4 py-1">
                  {heroEvents[currentSlide]?.category}
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  {heroEvents[currentSlide]?.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{format(new Date(heroEvents[currentSlide]?.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{heroEvents[currentSlide]?.city}</span>
                  </div>
                </div>
                <p className="text-xl text-gray-200">
                  {heroEvents[currentSlide]?.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Link href={`/events/${heroEvents[currentSlide]?.slug}`}>
                      Buy Tickets Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
                    <Link href="/events">
                      View All Events
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Slider Dots */}
            {heroEvents.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {heroEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="relative container h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to {siteConfig.name}</h1>
              <p className="text-xl mb-8">Premium Indian Cultural Events Across Germany</p>
              <Button size="lg" asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/events">Explore Events</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing cultural experiences happening across Germany
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.slice(0, 6).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {upcomingEvents.length > 6 && (
                <div className="text-center mt-12">
                  <Button size="lg" asChild variant="outline">
                    <Link href="/events">
                      View All Events
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Attend Section */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Attend Our Events?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the best of Indian culture in Germany
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Authentic Vibes</h3>
                <p className="text-muted-foreground">
                  Live music, traditional dance, and authentic cultural performances
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Safe & Organized</h3>
                <p className="text-muted-foreground">
                  Professional event management with strict safety protocols
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Connection</h3>
                <p className="text-muted-foreground">
                  Meet and connect with the vibrant Indian community in Germany
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Delicious Food</h3>
                <p className="text-muted-foreground">
                  Authentic Indian street food, snacks, and traditional delicacies
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Year-Round Events</h3>
                <p className="text-muted-foreground">
                  Regular events celebrating all major Indian festivals and occasions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Experience</h3>
                <p className="text-muted-foreground">
                  High-quality production, professional staff, and unforgettable memories
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Ticketing Works */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How Ticketing Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three convenient ways to purchase your tickets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-full" />
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-amber-500 mb-4">01</div>
                <h3 className="text-xl font-bold mb-3">Buy on Our Site</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Secure payment via Stripe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Instant QR code tickets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Email delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-blue-500 mb-4">02</div>
                <h3 className="text-xl font-bold mb-3">Buy on DesiPass</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Trusted platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Multiple payment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Quick checkout</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full" />
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl font-bold text-green-500 mb-4">03</div>
                <h3 className="text-xl font-bold mb-3">Buy on Eventbrite</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Global platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Buyer protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Easy management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container text-center">
          <Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connect with thousands of Indian expats across Germany. Join WhatsApp groups, follow us on social media, and stay updated on upcoming events.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild variant="secondary">
              <Link href="/community">
                Explore Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                WhatsApp Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-xl text-muted-foreground">Hear from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Best Holi celebration I've attended in Germany! The organization was perfect, colors were safe, and the energy was amazing."
                </p>
                <div className="font-semibold">Priya S.</div>
                <div className="text-sm text-muted-foreground">Berlin</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The Bollywood night was incredible! Great music, amazing crowd, and such a fun way to meet new people from the community."
                </p>
                <div className="font-semibold">Rahul K.</div>
                <div className="text-sm text-muted-foreground">Munich</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 pb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Felt like home! The Garba night brought back so many memories. Professional setup and family-friendly environment."
                </p>
                <div className="font-semibold">Anjali M.</div>
                <div className="text-sm text-muted-foreground">Frankfurt</div>
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
