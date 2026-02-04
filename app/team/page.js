'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Instagram, MapPin, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function TeamPage() {
  const [activeCity, setActiveCity] = useState('all');

  // Main Leadership Team (7-8 core members with designations and social links)
  const leadershipTeam = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      designation: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      instagram: 'https://instagram.com/rajeshkumar',
      bio: 'Visionary leader with 10+ years in event management'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      designation: 'Co-Founder & COO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/priyasharma',
      instagram: 'https://instagram.com/in/priyasharma',
      bio: 'Operations expert passionate about cultural events'
    },
    {
      id: 3,
      name: 'Amit Patel',
      designation: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/amitpatel',
      instagram: 'https://instagram.com/amitpatel',
      bio: 'Creative marketer driving brand growth'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      designation: 'Head of Events',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/snehareddy',
      instagram: 'https://instagram.com/snehareddy',
      bio: 'Event production specialist with eye for detail'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      designation: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/vikramsingh',
      instagram: 'https://instagram.com/vikramsingh',
      bio: 'Building strategic partnerships across Germany'
    },
    {
      id: 6,
      name: 'Anjali Verma',
      designation: 'Head of Community',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/anjaliverma',
      instagram: 'https://instagram.com/anjaliverma',
      bio: 'Connecting communities and building relationships'
    },
    {
      id: 7,
      name: 'Karthik Menon',
      designation: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/karthikmenon',
      instagram: 'https://instagram.com/karthikmenon',
      bio: 'Tech innovator building digital solutions'
    },
    {
      id: 8,
      name: 'Meera Iyer',
      designation: 'Head of Finance',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      linkedin: 'https://linkedin.com/in/meeraiyer',
      instagram: 'https://instagram.com/meeraiyer',
      bio: 'Financial strategist ensuring sustainable growth'
    }
  ];

  // City-wise Team Members
  const cityTeams = {
    berlin: [
      { id: 101, name: 'Rahul Kapoor', role: 'City Lead', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop' },
      { id: 102, name: 'Neha Das', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop' },
      { id: 103, name: 'Arjun Nair', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop' },
      { id: 104, name: 'Divya Chopra', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop' },
      { id: 105, name: 'Sanjay Gupta', role: 'Logistics Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' }
    ],
    munich: [
      { id: 201, name: 'Deepak Malhotra', role: 'City Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
      { id: 202, name: 'Pooja Agarwal', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop' },
      { id: 203, name: 'Rohan Saxena', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop' },
      { id: 204, name: 'Kavya Rao', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop' }
    ],
    frankfurt: [
      { id: 301, name: 'Suresh Krishnan', role: 'City Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' },
      { id: 302, name: 'Shreya Bhat', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop' },
      { id: 303, name: 'Nikhil Desai', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=300&fit=crop' },
      { id: 304, name: 'Riya Joshi', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop' }
    ],
    leipzig: [
      { id: 401, name: 'Aditya Mehta', role: 'City Lead', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop' },
      { id: 402, name: 'Tanvi Shah', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop' },
      { id: 403, name: 'Varun Pillai', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
      { id: 404, name: 'Ishita Banerjee', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop' }
    ],
    hamburg: [
      { id: 501, name: 'Manish Tiwari', role: 'City Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
      { id: 502, name: 'Nisha Kulkarni', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
      { id: 503, name: 'Siddharth Rao', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop' },
      { id: 504, name: 'Aditi Sharma', role: 'Volunteer Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop' }
    ],
    cologne: [
      { id: 601, name: 'Abhishek Pandey', role: 'City Lead', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop' },
      { id: 602, name: 'Swati Mishra', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop' },
      { id: 603, name: 'Praveen Kumar', role: 'Marketing Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' }
    ]
  };

  const cities = [
    { id: 'all', name: 'All Cities', icon: UsersIcon },
    { id: 'berlin', name: 'Berlin', icon: MapPin },
    { id: 'munich', name: 'Munich', icon: MapPin },
    { id: 'frankfurt', name: 'Frankfurt', icon: MapPin },
    { id: 'leipzig', name: 'Leipzig', icon: MapPin },
    { id: 'hamburg', name: 'Hamburg', icon: MapPin },
    { id: 'cologne', name: 'Cologne', icon: MapPin }
  ];

  const getDisplayTeams = () => {
    if (activeCity === 'all') {
      return Object.entries(cityTeams).flatMap(([city, members]) => 
        members.map(member => ({ ...member, city: city.charAt(0).toUpperCase() + city.slice(1) }))
      );
    }
    return cityTeams[activeCity] || [];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-purple-50">
      <Header />

      {/* Hero Section with Mixed Events Image */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1761503389996-f5157aa070a6"
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
            {leadershipTeam.map((member) => (
              <Card key={member.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
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
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.instagram}
                      target="_blank"
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-100 hover:bg-pink-600 hover:text-white transition-all"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* City-wise Teams Section */}
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
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-pink-600 font-semibold">{member.role}</p>
                  {activeCity === 'all' && member.city && (
                    <p className="text-xs text-gray-500 mt-1">{member.city}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1648260029310-5f1da359af9d"
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
              <Link href="/contact">
                Get In Touch
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-green-600 font-bold text-xl px-10 py-8 rounded-full backdrop-blur">
              <Link href="/partner">
                Partner With Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
