'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Instagram, MapPin, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PageHero from '@/components/PageHero';

export default function TeamPage() {
  const [activeCity, setActiveCity] = useState('all');
  const [leadershipTeam, setLeadershipTeam] = useState([]);
  const [cityTeams, setCityTeams] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      
      setLeadershipTeam(data.leadership || []);
      setCityTeams(data.cityTeams || {});
    } catch (error) {
      console.error('Error fetching team:', error);
      // Fallback to default team if API fails
      setLeadershipTeam(defaultLeadership);
      setCityTeams(defaultCityTeams);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data
  const defaultLeadership = [
    { id: '1', name: 'Rajesh Kumar', designation: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Visionary leader' },
    { id: '2', name: 'Priya Sharma', designation: 'Co-Founder & COO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Operations expert' }
  ];

  const defaultCityTeams = {
    berlin: [{ id: '101', name: 'Rahul Kapoor', role: 'City Lead', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop' }],
    munich: [{ id: '201', name: 'Deepak Malhotra', role: 'City Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' }]
  };

  const cities = [
    { id: 'all', name: 'All Cities', icon: UsersIcon },
    ...Object.keys(cityTeams).map(city => ({
      id: city,
      name: city.charAt(0).toUpperCase() + city.slice(1),
      icon: MapPin
    }))
  ];

  const getDisplayTeams = () => {
    if (activeCity === 'all') {
      return Object.entries(cityTeams).flatMap(([city, members]) => 
        members.map(member => ({ ...member, city: city.charAt(0).toUpperCase() + city.slice(1) }))
      );
    }
    return cityTeams[activeCity] || [];
  };

  const displayLeadership = leadershipTeam.length > 0 ? leadershipTeam : defaultLeadership;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920"
          alt="Our Team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 via-purple-600/90 to-pink-500/85" />
        <div className="relative container text-center text-white">
          <UsersIcon className="h-20 w-20 mx-auto mb-6" />
          <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-2xl">Meet Our Team</h1>
          <p className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto drop-shadow-lg">
            Passionate individuals bringing joy through cultural celebrations
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
          <p className="mt-4 text-gray-500">Loading team...</p>
        </div>
      ) : (
        <>
          {/* Leadership Team Section */}
          <section className="py-20 bg-white">
            <div className="container">
              <div className="text-center mb-16">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-6 py-2 mb-4">
                  Leadership
                </Badge>
                <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Core Team
                </h2>
                <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
                  Meet the visionaries behind IGK Events
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayLeadership.map((member) => (
                  <Card key={member.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-sm">{member.bio}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                      <p className="text-pink-600 font-semibold mb-4">{member.designation}</p>
                      <div className="flex gap-3 justify-center">
                        {member.linkedin && (
                          <Link href={member.linkedin} target="_blank" className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                            <Linkedin className="h-5 w-5" />
                          </Link>
                        )}
                        {member.instagram && (
                          <Link href={member.instagram} target="_blank" className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 hover:bg-pink-600 hover:text-white transition-all">
                            <Instagram className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {displayLeadership.length === 0 && (
                <p className="text-center text-gray-500 py-8">Leadership team coming soon...</p>
              )}
            </div>
          </section>

          {/* City-wise Teams Section */}
          {Object.keys(cityTeams).length > 0 && (
            <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
              <div className="container">
                <div className="text-center mb-16">
                  <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg px-6 py-2 mb-4">
                    Our Presence
                  </Badge>
                  <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    City Teams
                  </h2>
                  <p className="text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
                    Dedicated teams in cities across Germany
                  </p>
                </div>

                {/* City Selector */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                  {cities.map((city) => (
                    <Button
                      key={city.id}
                      onClick={() => setActiveCity(city.id)}
                      variant={activeCity === city.id ? 'default' : 'outline'}
                      className={`font-bold ${
                        activeCity === city.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'hover:border-pink-500'
                      }`}
                    >
                      <city.icon className="h-4 w-4 mr-2" />
                      {city.name}
                    </Button>
                  ))}
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {getDisplayTeams().map((member) => (
                    <Card key={member.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-bold mb-1">{member.name}</h3>
                        <p className="text-sm text-pink-600 font-semibold">{member.role || member.designation}</p>
                        {activeCity === 'all' && member.city && (
                          <p className="text-xs text-gray-500 mt-1">{member.city}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getDisplayTeams().length === 0 && (
                  <p className="text-center text-gray-500 py-8">No team members in this city yet</p>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* Join Team CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920"
          alt="Join Us"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 to-teal-600/95" />
        <div className="relative container text-center text-white">
          <h2 className="text-6xl font-black mb-6 drop-shadow-2xl">Want to Join Our Team?</h2>
          <p className="text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
            We're always looking for passionate individuals to join our mission of bringing communities together through cultural celebrations.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button size="lg" asChild className="bg-white text-green-600 hover:bg-gray-100 font-bold text-xl px-10 py-8 rounded-full shadow-2xl">
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-green-600 font-bold text-xl px-10 py-8 rounded-full backdrop-blur">
              <Link href="/partner">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
