'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, MessageCircle, Instagram, Facebook, Linkedin, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageHero from '@/components/PageHero';
import { siteConfig } from '@/config/site';

export default function CommunityPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    fetchCommunityLinks();
  }, []);

  const fetchCommunityLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community/links');
      const data = await res.json();
      setLinks(data.links || []);
      setSource(data.source || 'unknown');
    } catch (error) {
      console.error('Error fetching community links:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-green-500" />;
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-6 w-6 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6 text-blue-700" />;
      case 'telegram':
        return <MessageCircle className="h-6 w-6 text-blue-400" />;
      default:
        return <ExternalLink className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      whatsapp: 'bg-green-100 text-green-700',
      instagram: 'bg-pink-100 text-pink-700',
      facebook: 'bg-blue-100 text-blue-700',
      linkedin: 'bg-sky-100 text-sky-700',
      telegram: 'bg-blue-100 text-blue-600',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.other;
  };

  // Group links by category
  const groupedLinks = links.reduce((acc, link) => {
    const cat = link.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(link);
    return acc;
  }, {});

  const categoryOrder = ['whatsapp', 'instagram', 'facebook', 'linkedin', 'telegram', 'other'];
  const sortedCategories = Object.keys(groupedLinks).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <Header />
      
      {/* Hero */}
      <PageHero
        icon={Users}
        title="Join Our Community"
        subtitle="Connect with thousands of Indian expats across Germany. Join WhatsApp groups, follow us on social media, and stay updated!"
        backgroundImage="https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920"
        gradient="from-purple-600/90 to-pink-600/90"
      />

      {/* Linktree Source */}
      <section className="py-6 bg-white border-b">
        <div className="container flex items-center justify-center gap-4">
          <p className="text-gray-600">
            Community links from{' '}
            <Link 
              href={siteConfig.social.linktree} 
              target="_blank" 
              className="text-pink-600 hover:text-pink-700 font-semibold inline-flex items-center gap-1"
            >
              linktr.ee/igkonnekt
              <ExternalLink className="h-4 w-4" />
            </Link>
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCommunityLinks}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </section>

      {/* Community Links */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
              <p className="mt-4 text-gray-500">Loading community links...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="space-y-12">
              {sortedCategories.map(category => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-6">
                    {getCategoryIcon(category)}
                    <h2 className="text-2xl font-bold capitalize">{category === 'other' ? 'Other Links' : category}</h2>
                    <Badge className={getCategoryBadge(category)}>
                      {groupedLinks[category].length} {groupedLinks[category].length === 1 ? 'link' : 'links'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedLinks[category].map((link, index) => (
                      <Link key={index} href={link.url} target="_blank">
                        <Card className="h-full border-2 hover:border-pink-500 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-full ${getCategoryBadge(category).split(' ')[0]}`}>
                              {getCategoryIcon(category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate">{link.title}</h3>
                              <p className="text-sm text-gray-500 truncate">{link.url}</p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No Community Links Found</h3>
              <p className="text-gray-500 mb-6">
                Visit our Linktree directly to find community groups
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Link href={siteConfig.social.linktree} target="_blank">
                  Visit Linktree
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Direct Join CTA */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="container text-center text-white">
          <MessageCircle className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-6">Join WhatsApp Directly</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Want to connect directly? Send us a message and we'll add you to the relevant community groups!
          </p>
          <Button 
            size="lg" 
            asChild 
            className="bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-10 py-7 rounded-full shadow-xl"
          >
            <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
              <MessageCircle className="mr-2 h-6 w-6" />
              WhatsApp Us: {siteConfig.contact.phone}
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Follow */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-black text-center mb-10">Follow Us on Social Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <Link href={siteConfig.social.instagram} target="_blank">
              <Card className="text-center p-6 border-2 hover:border-pink-500 hover:shadow-lg transition-all hover:scale-105">
                <Instagram className="h-12 w-12 mx-auto mb-3 text-pink-500" />
                <p className="font-bold">Instagram</p>
              </Card>
            </Link>
            <Link href={siteConfig.social.facebook} target="_blank">
              <Card className="text-center p-6 border-2 hover:border-blue-500 hover:shadow-lg transition-all hover:scale-105">
                <Facebook className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <p className="font-bold">Facebook</p>
              </Card>
            </Link>
            <Link href={siteConfig.social.linkedin} target="_blank">
              <Card className="text-center p-6 border-2 hover:border-blue-700 hover:shadow-lg transition-all hover:scale-105">
                <Linkedin className="h-12 w-12 mx-auto mb-3 text-blue-700" />
                <p className="font-bold">LinkedIn</p>
              </Card>
            </Link>
            <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
              <Card className="text-center p-6 border-2 hover:border-green-500 hover:shadow-lg transition-all hover:scale-105">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p className="font-bold">WhatsApp</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
