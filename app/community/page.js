'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { siteConfig } from '@/config/site';

export default function CommunityPage() {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchCommunityLinks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [links, searchQuery, activeCategory]);

  const fetchCommunityLinks = async () => {
    try {
      const res = await fetch('/api/community/links');
      const data = await res.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error('Error fetching community links:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...links];

    if (searchQuery) {
      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(link => link.category === activeCategory);
    }

    setFilteredLinks(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5" />;
      case 'facebook':
      case 'telegram':
      case 'instagram':
        return <Users className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'whatsapp':
        return 'bg-green-100 text-green-700';
      case 'facebook':
        return 'bg-blue-100 text-blue-700';
      case 'telegram':
        return 'bg-sky-100 text-sky-700';
      case 'instagram':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = ['all', 'whatsapp', 'facebook', 'telegram', 'instagram'];
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'all' ? links.length : links.filter(l => l.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="py-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container">
          <Users className="h-12 w-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Community</h1>
          <p className="text-xl max-w-2xl">
            Connect with thousands of Indian expats across Germany. Find your city group, make friends, and stay updated on events.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b bg-background">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-12 flex-1">
        <div className="container">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5">
              <TabsTrigger value="all">All ({categoryCounts.all})</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp ({categoryCounts.whatsapp})</TabsTrigger>
              <TabsTrigger value="facebook">Facebook ({categoryCounts.facebook})</TabsTrigger>
              <TabsTrigger value="telegram">Telegram ({categoryCounts.telegram})</TabsTrigger>
              <TabsTrigger value="instagram">Instagram ({categoryCounts.instagram})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLinks.map((link, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{link.title}</h3>
                            <Badge className={getCategoryColor(link.category)}>
                              {link.category}
                            </Badge>
                          </div>
                          <div className={`p-2 rounded-full ${getCategoryColor(link.category)}`}>
                            {getCategoryIcon(link.category)}
                          </div>
                        </div>
                        <Button asChild className="w-full mt-4" variant="outline">
                          <Link href={link.url} target="_blank">
                            Join Group
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No groups found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Disclaimer */}
          <Card className="mt-12 bg-muted/40">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Disclaimer:</strong> Community groups are independently managed. Please follow group rules and guidelines. {siteConfig.name} is not responsible for content shared in these groups.
              </p>
            </CardContent>
          </Card>

          {/* Main Social Links */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-6">Follow {siteConfig.name}</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={siteConfig.social.instagram} target="_blank">
                  Instagram
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={siteConfig.social.facebook} target="_blank">
                  Facebook
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                  WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
