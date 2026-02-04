'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, Users, ExternalLink, Download, Share2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { format } from 'date-fns';
import { siteConfig } from '@/config/site';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.slug}`);
      const data = await res.json();
      if (data.event) {
        setEvent(data.event);
      } else {
        router.push('/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${event.title} at ${siteConfig.name}!`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const downloadICS = () => {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(new Date(event.date), "yyyyMMdd'T'HHmmss")}
SUMMARY:${event.title}
LOCATION:${event.venue}, ${event.city}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug}.ics`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Event Hero */}
      <section className="relative h-[400px] overflow-hidden">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative container h-full flex items-end pb-8">
          <div className="text-white space-y-4 max-w-3xl">
            <Badge className="bg-amber-500 text-white">{event.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(eventDate, 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{format(eventDate, 'HH:mm')} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.longDescription || event.description}
                </p>
              </CardContent>
            </Card>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="font-semibold text-primary min-w-[80px]">{item.time}</div>
                        <div className="flex-1">
                          <div className="font-medium">{item.activity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rules & Safety */}
            {event.rules && event.rules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Safety Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.rules.map((rule, index) => (
                      <li key={index} className="flex gap-2">
                        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* FAQs */}
            {event.faqs && event.faqs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {event.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Booking Card */}
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Get Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPast ? (
                  <>
                    {/* Our Site Tickets */}
                    <div className="space-y-3">
                      <div className="font-semibold">Option 1: Buy on Our Site</div>
                      {event.ticketTypes && event.ticketTypes.map(ticket => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold">{ticket.name}</div>
                              <div className="text-sm text-muted-foreground">{ticket.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">€{ticket.price}</div>
                            </div>
                          </div>
                          {ticket.available ? (
                            <Button className="w-full mt-2" variant="default">
                              Select
                            </Button>
                          ) : (
                            <Button className="w-full mt-2" variant="outline" disabled>
                              Sold Out
                            </Button>
                          )}
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">
                        Secure payment via Stripe. Instant QR code tickets via email.
                        <br />
                        <span className="text-amber-600 font-semibold">Note: Stripe integration pending - use external links below</span>
                      </p>
                    </div>

                    <Separator />

                    {/* External Tickets */}
                    <div className="space-y-3">
                      <div className="font-semibold">Option 2 & 3: External Platforms</div>
                      
                      {event.externalLinks?.desipass && (
                        <Button className="w-full" variant="outline" asChild>
                          <Link href={event.externalLinks.desipass} target="_blank">
                            Buy on DesiPass
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {event.externalLinks?.eventbrite && (
                        <Button className="w-full" variant="outline" asChild>
                          <Link href={event.externalLinks.eventbrite} target="_blank">
                            Buy on Eventbrite
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Badge variant="secondary" className="mb-2">Event Ended</Badge>
                    <p className="text-sm text-muted-foreground">This event has already taken place.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Venue Card */}
            <Card>
              <CardHeader>
                <CardTitle>Venue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold">{event.venue}</div>
                  <div className="text-sm text-muted-foreground">{event.venueAddress}</div>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={event.googleMapsUrl} target="_blank">
                    <MapPin className="mr-2 h-4 w-4" />
                    View on Google Maps
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Share & Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Share & Save</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" onClick={() => handleShare('whatsapp')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share on WhatsApp
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleShare('copy')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button className="w-full" variant="outline" onClick={downloadICS}>
                  <Download className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Have questions about this event? Get in touch with us.
                </p>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                    Contact Organiser
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
