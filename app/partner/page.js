'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Handshake, Mail, MessageCircle, Building, Music, Utensils, Camera, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { siteConfig } from '@/config/site';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    partnershipType: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Send to API
    console.log('Partnership inquiry:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const partnershipTypes = [
    {
      icon: <Building className="h-8 w-8" />,
      title: 'Venue Partnership',
      description: 'Own a venue? Partner with us to host amazing events.',
      benefits: ['Regular bookings', 'Marketing exposure', 'Revenue share']
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: 'Artist / Performer',
      description: 'DJs, singers, dancers - showcase your talent at our events.',
      benefits: ['Performance opportunities', 'Exposure', 'Fair compensation']
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: 'Food & Beverage',
      description: 'Food stalls, catering services, or beverage suppliers.',
      benefits: ['Guaranteed audience', 'Brand visibility', 'Sales opportunities']
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: 'Service Provider',
      description: 'Photography, videography, decoration, or technical services.',
      benefits: ['Project work', 'Portfolio building', 'Networking']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-purple-700 text-white">
        <div className="container text-center">
          <Handshake className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner With Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Join us in creating unforgettable cultural experiences across Germany. We're always looking for passionate partners.
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-muted-foreground">Various ways to collaborate with {siteConfig.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {partnershipTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <div className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 bg-muted/40">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-lg mb-2">Growing Community</h3>
                  <p className="text-muted-foreground text-sm">
                    Access to thousands of engaged community members across major German cities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-lg mb-2">Professional Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Work with experienced event organizers who understand cultural nuances.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-lg mb-2">Marketing Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Benefit from our strong social media presence and marketing channels.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-bold text-lg mb-2">Fair Terms</h3>
                  <p className="text-muted-foreground text-sm">
                    Transparent agreements and mutually beneficial partnerships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Get In Touch</CardTitle>
                <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="partnershipType">Partnership Type</Label>
                    <Input
                      id="partnershipType"
                      placeholder="e.g., Venue, Artist, Food Vendor"
                      value={formData.partnershipType}
                      onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us about your partnership proposal..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    {submitted ? 'Submitted!' : 'Submit Partnership Inquiry'}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Prefer to reach out directly?
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button variant="outline" asChild>
                      <Link href={`mailto:${siteConfig.contact.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Us
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
