'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { toast } from 'sonner';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    eventAttended: '',
    rating: 5,
    testimonial: ''
  });

  useEffect(() => {
    fetchTestimonials();
    fetchEvents();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?limit=20');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating !== 5) {
      toast.error('Only 5-star ratings are accepted', {
        description: 'We appreciate your feedback! However, only 5-star ratings are displayed on our website.'
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.eventAttended || !formData.testimonial) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Thank you for your review!', {
          description: 'Your testimonial will be displayed after moderation.'
        });
        setFormData({
          name: '',
          email: '',
          city: '',
          eventAttended: '',
          rating: 5,
          testimonial: ''
        });
      } else {
        toast.error(data.error || 'Failed to submit review', {
          description: data.message
        });
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Stuttgart', 'Düsseldorf', 'Other'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 via-white to-orange-50">
      <Header />
      
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529543544277-c91de6e7e5a9?w=1920"
          alt="Share Your Experience"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/90 to-orange-600/90" />
        <div className="relative container text-center text-white">
          <Badge className="bg-white/20 text-white text-lg px-6 py-2 mb-6">
            Community Voices
          </Badge>
          <h1 className="text-6xl font-black mb-6 drop-shadow-2xl">Share Your Experience</h1>
          <p className="text-2xl max-w-3xl mx-auto opacity-95">
            Tell us about your experience at our events. Your feedback helps us create better experiences for everyone!
          </p>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Submission Form */}
          <div>
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Submit Your Review</CardTitle>
                <CardDescription className="text-yellow-100">
                  Share your experience with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John D."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event">Event Attended *</Label>
                      <Select value={formData.eventAttended} onValueChange={(value) => setFormData({ ...formData, eventAttended: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map(event => (
                            <SelectItem key={event.id} value={event.title}>{event.title}</SelectItem>
                          ))}
                          <SelectItem value="Other">Other Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-10 w-10 ${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <AlertCircle className="h-4 w-4" />
                      Only 5-star ratings are accepted and displayed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonial">Your Review *</Label>
                    <Textarea
                      id="testimonial"
                      placeholder="Tell us about your experience at the event..."
                      rows={5}
                      value={formData.testimonial}
                      onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    disabled={submitting || formData.rating !== 5}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Review
                      </>
                    )}
                  </Button>

                  {formData.rating !== 5 && (
                    <p className="text-sm text-red-500 text-center">
                      Please select 5 stars to submit your review
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Testimonials */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Recent Reviews</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {testimonials.map((testimonial, index) => (
                  <Card key={testimonial.id || index} className="border hover:border-yellow-500 transition-all">
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4">"{testimonial.testimonial}"</p>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
                          {testimonial.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-bold">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">
                            {testimonial.city && `${testimonial.city} • `}{testimonial.eventAttended}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
