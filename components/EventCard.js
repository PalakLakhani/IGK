'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
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
    if (percentSold >= 95) return <Badge className="bg-red-500 text-white font-bold animate-pulse">🔥 SOLD OUT</Badge>;
    if (percentSold >= 80) return <Badge className="bg-orange-500 text-white font-bold animate-pulse">⚡ SELLING FAST</Badge>;
    if (percentSold >= 60) return <Badge className="bg-yellow-500 text-black font-bold">⏰ LAST CHANCE</Badge>;
    return null;
  };

  const lowestPrice = event.ticketTypes && event.ticketTypes.length > 0 
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  const categoryColors = {
    'Holi': 'from-pink-500 to-purple-500',
    'Bollywood Night': 'from-blue-500 to-purple-500',
    'Garba': 'from-orange-500 to-red-500',
    'default': 'from-purple-500 to-pink-500'
  };

  const gradientClass = categoryColors[event.category] || categoryColors.default;

  return (
    <Card className="overflow-hidden border-none shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105 transform bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.poster}
          alt={event.title}
          fill
          className="object-cover transition-transform hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}/40 to-transparent`} />
        {getStatusBadge() && (
          <div className="absolute top-4 right-4 z-10">
            {getStatusBadge()}
          </div>
        )}
        {event.featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-yellow-400 text-black font-bold shadow-lg">
              <Sparkles className="h-4 w-4 mr-1" />
              FEATURED
            </Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className={`bg-gradient-to-r ${gradientClass} text-white font-bold text-sm px-4 py-2 shadow-lg`}>
            {event.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-black text-2xl mb-4 line-clamp-2 text-gray-900">{event.title}</h3>
        <div className="space-y-3 text-base">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 text-pink-600">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="font-semibold">{format(eventDate, 'EEE, MMM dd, yyyy • HH:mm')}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-semibold">{event.city} • {event.venue}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-semibold">From</p>
          <p className="text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">€{lowestPrice}</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-full px-8 shadow-lg">
          <Link href={`/events/${event.slug}`}>
            View & Buy
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
