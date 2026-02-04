'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { format } from 'date-fns';

export default function TicketsPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/orders/lookup?orderId=${orderId}&email=${email}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to lookup order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Tickets</h1>
          <p className="text-xl">Lookup your order and download your tickets</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Tickets</CardTitle>
              <p className="text-sm text-muted-foreground">Enter your order ID and email to view your tickets</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    placeholder="ORD-1234567890-ABCD"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Searching...' : 'Find My Tickets'}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-8 space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Order Found!
                    </div>
                    <p className="text-sm text-green-700">Order ID: {result.order.orderId}</p>
                    <p className="text-sm text-green-700">Status: {result.order.status}</p>
                    <p className="text-sm text-green-700">Date: {format(new Date(result.order.createdAt), 'PPP')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Your Tickets ({result.tickets.length})</h3>
                    <div className="space-y-4">
                      {result.tickets.map((ticket, index) => (
                        <Card key={ticket.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex-1">
                                <Badge className="mb-2">{ticket.ticketType}</Badge>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Ticket Code: <span className="font-mono font-semibold">{ticket.ticketCode}</span>
                                </p>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Attendee: {ticket.attendeeName}
                                </p>
                                {ticket.isUsed && (
                                  <Badge variant="secondary" className="mt-2">
                                    Used on {format(new Date(ticket.usedAt), 'PPP')}
                                  </Badge>
                                )}
                              </div>
                              {ticket.qrCode && (
                                <div className="flex-shrink-0">
                                  <Image
                                    src={ticket.qrCode}
                                    alt="QR Code"
                                    width={150}
                                    height={150}
                                    className="border rounded"
                                  />
                                  <p className="text-xs text-center text-muted-foreground mt-2">Show at entry</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground p-4 bg-muted/40 rounded-lg">
                    <p className="font-semibold mb-2">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Save or screenshot your QR codes</li>
                      <li>Present QR code at event entry</li>
                      <li>Each ticket can only be used once</li>
                      <li>Tickets are non-refundable but transferable</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
