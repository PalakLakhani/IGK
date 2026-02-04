'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';

export default function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const capacity = event.capacity || 1000;
  const sold = event.ticketTypes?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;
  const percentSold = (sold / capacity) * 100;

  const getStatusBadge = () => {
    if (eventDate < now) return null;
    if (percentSold >= 95) return <Badge variant="destructive">SOLD OUT</Badge>;
    if (percentSold >= 80) return <Badge variant="destructive" className="bg-orange-500">SELLING FAST</Badge>;
    if (percentSold >= 60) return <Badge variant="secondary">LAST CHANCE</Badge>;
    return null;
  };

  const lowestPrice = event.ticketTypes && event.ticketTypes.length > 0 
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {getStatusBadge() && (
          <div className="absolute top-3 right-3">
            {getStatusBadge()}
          </div>
        )}
        {event.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-amber-500 text-white">FEATURED</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="outline">{event.category}</Badge>
        </div>
        <h3 className="font-bold text-xl mb-3 line-clamp-2">{event.title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(eventDate, 'EEE, MMM dd, yyyy • HH:mm')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.city} • {event.venue}</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">From</p>
          <p className="text-2xl font-bold">€{lowestPrice}</p>
        </div>
        <Button asChild>
          <Link href={`/events/${event.slug}`}>
            View & Buy
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
