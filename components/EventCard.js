'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';

// Helper function to generate excerpt from description
// Strips emojis and HTML, returns first 140 chars + "..."
function generateExcerpt(description, maxLength = 140) {
  if (!description) return '';
  
  // Strip HTML tags
  let text = description.replace(/<[^>]*>/g, '');
  
  // Strip common emojis (simplified regex)
  text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]/gu, '');
  
  // Clean up multiple spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate
  if (text.length <= maxLength) return text;
  
  // Cut at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

export default function EventCard({ event }) {
  const eventDate = new Date(event.startDateTime || event.date);
  const now = new Date();
  const isPast = eventDate < now;
  
  // Get ticket URLs
  const hasDesipass = event.desipassUrl || event.ticketPlatforms?.desipassUrl;
  const hasEventbrite = event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl;
  const hasTickets = hasDesipass || hasEventbrite;

  const categoryColors = {
    'Holi': 'from-pink-500 to-purple-500',
    'Bollywood Night': 'from-blue-500 to-purple-500',
    'Garba': 'from-orange-500 to-red-500',
    'Navratri': 'from-orange-500 to-yellow-500',
    'Cultural': 'from-amber-500 to-orange-500',
    'Concert': 'from-red-500 to-pink-500',
    'default': 'from-purple-500 to-pink-500'
  };

  const gradientClass = categoryColors[event.category] || categoryColors.default;
  
  // Use shortSummary if available, otherwise generate excerpt from description
  const cardSummary = event.shortSummary || generateExcerpt(event.description, 160);

  return (
    <Card className="overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105 transform bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.coverImagePath || event.poster || event.coverImageUrl || 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800'}
          alt={event.title}
          fill
          className="object-cover transition-transform hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}/40 to-transparent`} />
        
        {/* Badges Container - Fixed overflow with flex-wrap */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 overflow-hidden">
          {event.featured && !isPast && (
            <Badge className="bg-yellow-400 text-black font-bold shadow-lg text-xs px-2 py-0.5 flex-shrink-0">
              <Sparkles className="h-3 w-3 mr-1" />
              FEATURED
            </Badge>
          )}
          {/* Ticket platform badges - constrained */}
          {hasDesipass && (
            <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5 flex-shrink-0">
              DesiPass
            </Badge>
          )}
          {hasEventbrite && (
            <Badge className="bg-orange-600 text-white text-xs px-2 py-0.5 flex-shrink-0">
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
        
        {/* Card Summary - from shortSummary or auto-excerpt */}
        {cardSummary && (
          <p className="mt-4 text-gray-600 line-clamp-2 leading-relaxed text-sm">
            {cardSummary}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        {/* Ticket Buttons - External platforms only */}
        {!isPast && hasTickets ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {hasDesipass && (
              <Button asChild className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Link href={event.desipassUrl || event.ticketPlatforms?.desipassUrl} target="_blank">
                  <span className="truncate">DesiPass</span>
                  <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              </Button>
            )}
            {hasEventbrite && (
              <Button asChild className="flex-1 min-w-0 bg-orange-600 hover:bg-orange-700 text-white font-bold">
                <Link href={event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl} target="_blank">
                  <span className="truncate">Eventbrite</span>
                  <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              </Button>
            )}
          </div>
        ) : !isPast ? (
          <Button disabled className="w-full bg-gray-200 text-gray-500">
            Tickets Coming Soon
          </Button>
        ) : null}

        {/* View Details */}
        <Button asChild variant="outline" className="w-full">
          <Link href={`/events/${event.slug}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
