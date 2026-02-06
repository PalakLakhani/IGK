'use client';

import { Users, Heart, Award, Target, Shield, Sparkles, Building2, Calendar, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import StatsBar from '@/components/StatsBar';
import PageHero from '@/components/PageHero';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <PageHero
        icon={Info}
        title={`About ${siteConfig.name}`}
        subtitle={siteConfig.tagline}
        backgroundImage="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920"
        gradient="from-indigo-900/95 via-indigo-700/90 to-purple-600/85"
      />

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Our Story</h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              Indo-German Konnekt (IGK) was founded in 2023 with one clear purpose: <strong>to make expats feel at home, even when they are miles away from it</strong>.
            </p>
            
            <p className="text-lg text-muted-foreground mb-6">
              Relocating to a new country brings growth and opportunity, but it also brings distance from culture, traditions, and familiar celebrations. IGK was created to bridge that emotional gap by building experiences that reconnect people with joy, belonging, and community.
            </p>
            
            <p className="text-lg text-muted-foreground mb-6">
              From day one, IGK chose quality over shortcuts. We do not simply organize events. We <strong>curate experiences</strong> that are safe, inclusive, well-managed, and deeply rooted in culture. Every event is designed to feel welcoming, premium, and thoughtfully executed.
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 my-8 border-l-4 border-pink-500">
              <p className="text-lg text-gray-700 mb-4">
                IGK made history by organizing <strong>Europe's first-ever Open-Air Navaratri in Berlin</strong>, setting a new benchmark for Indian cultural celebrations at scale. This was followed by <strong>Frankfurt's biggest Open-Air Holi</strong>, bringing together thousands of people in a vibrant, joyful, and professionally managed environment.
              </p>
            </div>

            <p className="text-lg text-muted-foreground mb-4">
              We introduced trend-setting concepts that reshaped the cultural event landscape in Germany:
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
              <li><strong>Fake Shadi</strong>, which became the biggest and most talked-about edition of its kind.</li>
              <li>Upcoming formats like <strong>Bhajan Clubbing</strong>, blending spirituality with modern musical expression.</li>
              <li>Carefully curated <strong>Speed Dating events</strong> focused on genuine connections in a respectful and comfortable setting.</li>
            </ul>

            <div className="bg-green-50 rounded-xl p-6 my-8 border-l-4 border-green-500">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-green-800 mb-2">Safety First</h4>
                  <p className="text-green-700">
                    A core pillar of IGK is <strong>safety</strong>, especially for women and families. Our events follow strict safety standards, professional security planning, controlled entry systems, and clear crowd management. Whether someone attends alone, with friends, or with family, the experience should always feel secure, respectful, and enjoyable.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-6">
              As IGK grew, so did our vision.
            </p>

            <p className="text-lg text-muted-foreground mb-6">
              Today, IGK has expanded beyond cultural festivals and social events. We are now actively involved in <strong>weddings, corporate events, private celebrations, and large-scale professional gatherings</strong>. From destination-style wedding events and pre-wedding functions to corporate parties, brand activations, and community networking events, IGK brings the same attention to detail, creativity, and reliability to every format.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <Card className="bg-pink-50 border-pink-200">
                <CardContent className="pt-6 text-center">
                  <Heart className="h-10 w-10 mx-auto mb-3 text-pink-600" />
                  <h4 className="font-bold text-pink-800">Weddings</h4>
                  <p className="text-sm text-pink-700 mt-2">Personalized, elegant, and culturally rich</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-bold text-blue-800">Corporate</h4>
                  <p className="text-sm text-blue-700 mt-2">Professional, structured, and brand-aligned</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6 text-center">
                  <Sparkles className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                  <h4 className="font-bold text-purple-800">Community</h4>
                  <p className="text-sm text-purple-700 mt-2">Vibrant, inclusive, and unforgettable</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg text-muted-foreground mb-6">
              Behind every IGK experience is a dedicated team that understands the expat journey first-hand. A team that values professionalism, cultural sensitivity, and flawless execution. From concept to closure, every detail is planned with intention.
            </p>

            <p className="text-lg text-muted-foreground mb-6">
              Today, IGK stands as a trusted name for Indian cultural, social, corporate, and private events across Germany and Europe. Our success is not just measured in sold-out events, but in trust, repeat communities, and the feeling people carry back with them.
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 my-8 text-center">
              <p className="text-xl font-semibold text-purple-800 italic">
                "For many, IGK is not just an event organizer. It is a place where memories are created, connections are formed, and home is rediscovered."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-none shadow-xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-center text-lg">
                  To <strong>deliver safe, premium, and meaningful event experiences</strong> across cultural, social, wedding, and corporate formats, helping people connect, celebrate, and belong wherever they are.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-none shadow-xl bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-center text-lg">
                  To become <strong>Europe's most trusted and comprehensive platform for cultural, social, wedding, and corporate events</strong>, setting new standards in quality, safety, and community-driven experiences for expats and global audiences alike.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
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
