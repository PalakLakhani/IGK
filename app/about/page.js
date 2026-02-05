'use client';

import { Users, Heart, Award, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import StatsBar from '@/components/StatsBar';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About {siteConfig.name}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Bringing the vibrant colors of Indian culture to Germany, one event at a time.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4">
              {siteConfig.name} was founded with a simple mission: to create a home away from home for the Indian community in Germany. What started as small gatherings has grown into Germany's premier Indian cultural events platform.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We celebrate the rich tapestry of Indian culture - from the colorful Holi festivals to energetic Bollywood nights, traditional Garba celebrations to innovative fusion events. Every event is designed to bring people together, create lasting memories, and keep our cultural roots alive.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we organize events across major German cities including Berlin, Munich, Frankfurt, Hamburg, and more, reaching thousands of community members every year.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  Building connections and fostering belonging within the Indian diaspora.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  High-quality production, professional management, memorable experiences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Inclusivity</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to all - families, singles, students, professionals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Authenticity</h3>
                <p className="text-sm text-muted-foreground">
                  Genuine cultural experiences that honor our traditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats - Using shared StatsBar component */}
      <StatsBar variant="amber" showReviewCount={true} />

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us at Our Next Event</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the celebration. Experience the joy, music, food, and community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
