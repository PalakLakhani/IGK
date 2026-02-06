'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Handshake, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function TrustedByPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
        <div className="container text-center">
          <Handshake className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Trusted by the Best</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            We're proud to collaborate with leading brands and organizations across Germany and beyond.
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20 flex-1 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Collaborating Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These trusted brands have partnered with IGK to create memorable experiences and impactful events.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-6xl mx-auto">
              {brands.map((brand) => (
                <Card 
                  key={brand.id} 
                  className="border-none shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-20 mb-3">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-3">
                        <Building2 className="h-10 w-10 text-purple-600" />
                      </div>
                    )}
                    <p className="font-semibold text-center text-sm">{brand.name}</p>
                    {brand.websiteUrl && (
                      <a 
                        href={brand.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:underline mt-1"
                      >
                        Visit Website
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground text-lg">Partner logos coming soon.</p>
              <p className="text-sm text-gray-400 mt-2">
                Contact us to become a collaboration partner!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Partnering With Us?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join our growing network of partners and reach thousands of community members.
          </p>
          <a 
            href="/partner" 
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Handshake className="h-5 w-5" />
            Become a Partner
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
