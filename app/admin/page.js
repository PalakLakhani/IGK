'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, DollarSign, BarChart3, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true);
      setError('');
      localStorage.setItem('admin_password', password);
      fetchData(password);
    } else {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      setAuthenticated(true);
      fetchData(savedPassword);
    }
  }, []);

  const fetchData = async (pwd) => {
    setLoading(true);
    try {
      const eventsRes = await fetch('/api/events?status=published');
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      const ordersRes = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': pwd }
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    localStorage.removeItem('admin_password');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Dashboard</CardTitle>
            <p className="text-center text-muted-foreground">{siteConfig.name}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalEvents: events.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Badge variant="outline">{siteConfig.name}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              <Eye className="mr-2 h-4 w-4" />
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold">{stats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-4">
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.city}
                        </p>
                      </div>
                      <Badge>{event.category}</Badge>
                    </div>
                  ))}</div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No events found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{order.totalAmount || 0}</p>
                        <Badge>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
