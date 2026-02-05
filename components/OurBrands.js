'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { brands } from '@/lib/brands-data';

export default function OurBrands({ variant = 'full' }) {
  if (variant === 'footer') {
    return (
      <div>
        <h3 className="font-semibold mb-4">Our Brands</h3>
        <ul className="space-y-2 text-sm">
          {brands.map(brand => (
            <li key={brand.id}>
              <Link 
                href={`/brands/${brand.slug}`}
                className="text-muted-foreground hover:text-primary flex items-center gap-2"
              >
                <ArrowRight className="h-3 w-3" />
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-6 py-2 mb-4">
            Our Portfolio
          </Badge>
          <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Brands
          </h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
            Specialized event brands creating memorable experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {brands.map((brand) => (
            <Card 
              key={brand.id} 
              className="overflow-hidden border-2 hover:border-pink-500 transition-all hover:scale-105 group"
            >
              <CardContent className="p-8">
                <Link href={`/brands/${brand.slug}`} className="block">
                  <div className="relative h-32 mb-6 flex items-center justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-10 rounded-lg`} />
                    <div className="relative w-24 h-24">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-black text-2xl mb-2 text-center">{brand.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4 min-h-[40px]">
                    {brand.description}
                  </p>
                </Link>
                
                <div className="flex gap-2">
                  <Button 
                    asChild
                    className={`flex-1 bg-gradient-to-r ${brand.color} text-white hover:opacity-90`}
                    size="sm"
                  >
                    <Link href={`/brands/${brand.slug}`}>
                      View Brand
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-2"
                  >
                    <Link href={brand.instagram} target="_blank">
                      <Instagram className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
