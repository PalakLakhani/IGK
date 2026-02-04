'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function NewsletterSubscribe({ variant = 'inline' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Success! You've been subscribed to our newsletter.");
        setEmail('');
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'footer') {
    return (
      <div>
        <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to get updates on upcoming events and exclusive offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-pink-500 to-purple-500">
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 h-12 text-lg"
      />
      <Button 
        type="submit" 
        disabled={loading}
        size="lg"
        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 font-bold px-8"
      >
        <Mail className="mr-2 h-5 w-5" />
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
