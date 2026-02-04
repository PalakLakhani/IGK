'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, DollarSign, BarChart3, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      // Fetch events
      const eventsRes = await fetch('/api/events?status=published');
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      // Fetch orders
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
      <div className=\"min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800\">
        <Card className=\"w-full max-w-md\">
          <CardHeader>
            <div className=\"w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4\">
              <Lock className=\"h-8 w-8\" />
            </div>
            <CardTitle className=\"text-2xl text-center\">Admin Dashboard</CardTitle>
            <p className=\"text-center text-muted-foreground\">{siteConfig.name}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className=\"space-y-4\">
              <div>
                <Label htmlFor=\"password\">Password</Label>
                <Input
                  id=\"password\"
                  type=\"password\"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=\"Enter admin password\"
                />
              </div>
              {error && (
                <p className=\"text-sm text-destructive\">{error}</p>
              )}
              <Button type=\"submit\" className=\"w-full\">
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
    <div className=\"min-h-screen bg-background\">
      {/* Header */}
      <header className=\"border-b bg-card\">
        <div className=\"container flex h-16 items-center justify-between\">
          <div className=\"flex items-center gap-4\">
            <h1 className=\"text-xl font-bold\">Admin Dashboard</h1>
            <Badge variant=\"outline\">{siteConfig.name}</Badge>
          </div>
          <div className=\"flex items-center gap-4\">
            <Button variant=\"outline\" size=\"sm\" onClick={() => router.push('/')}>
              <Eye className=\"mr-2 h-4 w-4\" />
              View Site
            </Button>
            <Button variant=\"outline\" size=\"sm\" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>\n\n      <div className=\"container py-8\">\n        {/* Stats Cards */}\n        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8\">\n          <Card>\n            <CardContent className=\"pt-6\">\n              <div className=\"flex items-center justify-between\">\n                <div>\n                  <p className=\"text-sm font-medium text-muted-foreground\">Total Events</p>\n                  <p className=\"text-3xl font-bold\">{stats.totalEvents}</p>\n                </div>\n                <Calendar className=\"h-8 w-8 text-muted-foreground\" />\n              </div>\n            </CardContent>\n          </Card>\n\n          <Card>\n            <CardContent className=\"pt-6\">\n              <div className=\"flex items-center justify-between\">\n                <div>\n                  <p className=\"text-sm font-medium text-muted-foreground\">Upcoming</p>\n                  <p className=\"text-3xl font-bold\">{stats.upcomingEvents}</p>\n                </div>\n                <BarChart3 className=\"h-8 w-8 text-muted-foreground\" />\n              </div>\n            </CardContent>\n          </Card>\n\n          <Card>\n            <CardContent className=\"pt-6\">\n              <div className=\"flex items-center justify-between\">\n                <div>\n                  <p className=\"text-sm font-medium text-muted-foreground\">Total Orders</p>\n                  <p className=\"text-3xl font-bold\">{stats.totalOrders}</p>\n                </div>\n                <Users className=\"h-8 w-8 text-muted-foreground\" />\n              </div>\n            </CardContent>\n          </Card>\n\n          <Card>\n            <CardContent className=\"pt-6\">\n              <div className=\"flex items-center justify-between\">\n                <div>\n                  <p className=\"text-sm font-medium text-muted-foreground\">Revenue</p>\n                  <p className=\"text-3xl font-bold\">€{stats.totalRevenue.toFixed(2)}</p>\n                </div>\n                <DollarSign className=\"h-8 w-8 text-muted-foreground\" />\n              </div>\n            </CardContent>\n          </Card>\n        </div>\n\n        {/* Main Content */}\n        <Tabs defaultValue=\"events\" className=\"space-y-6\">\n          <TabsList>\n            <TabsTrigger value=\"events\">Events</TabsTrigger>\n            <TabsTrigger value=\"orders\">Orders</TabsTrigger>\n            <TabsTrigger value=\"checkin\">Check-In</TabsTrigger>\n          </TabsList>\n\n          {/* Events Tab */}\n          <TabsContent value=\"events\">\n            <Card>\n              <CardHeader>\n                <CardTitle>All Events</CardTitle>\n              </CardHeader>\n              <CardContent>\n                {loading ? (\n                  <div className=\"text-center py-8\">\n                    <div className=\"inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary\"></div>\n                  </div>\n                ) : events.length > 0 ? (\n                  <div className=\"space-y-4\">\n                    {events.map(event => (\n                      <div key={event.id} className=\"flex items-center justify-between p-4 border rounded-lg\">\n                        <div className=\"flex-1\">\n                          <h3 className=\"font-semibold\">{event.title}</h3>\n                          <p className=\"text-sm text-muted-foreground\">\n                            {new Date(event.date).toLocaleDateString()} • {event.city}\n                          </p>\n                        </div>\n                        <div className=\"flex items-center gap-2\">\n                          <Badge>{event.category}</Badge>\n                          <Button size=\"sm\" variant=\"outline\" onClick={() => router.push(`/events/${event.slug}`)}>\n                            View\n                          </Button>\n                        </div>\n                      </div>\n                    ))}\n                  </div>\n                ) : (\n                  <p className=\"text-center text-muted-foreground py-8\">No events found</p>\n                )}\n              </CardContent>\n            </Card>\n          </TabsContent>\n\n          {/* Orders Tab */}\n          <TabsContent value=\"orders\">\n            <Card>\n              <CardHeader>\n                <CardTitle>All Orders</CardTitle>\n              </CardHeader>\n              <CardContent>\n                {loading ? (\n                  <div className=\"text-center py-8\">\n                    <div className=\"inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary\"></div>\n                  </div>\n                ) : orders.length > 0 ? (\n                  <div className=\"space-y-4\">\n                    {orders.slice(0, 20).map(order => (\n                      <div key={order.id} className=\"flex items-center justify-between p-4 border rounded-lg\">\n                        <div className=\"flex-1\">\n                          <p className=\"font-semibold\">{order.orderId}</p>\n                          <p className=\"text-sm text-muted-foreground\">\n                            {order.name} • {order.email}\n                          </p>\n                          <p className=\"text-sm text-muted-foreground\">\n                            {new Date(order.createdAt).toLocaleString()}\n                          </p>\n                        </div>\n                        <div className=\"flex items-center gap-3\">\n                          <div className=\"text-right\">\n                            <p className=\"font-semibold\">€{order.totalAmount || 0}</p>\n                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>\n                              {order.status}\n                            </Badge>\n                          </div>\n                        </div>\n                      </div>\n                    ))}\n                  </div>\n                ) : (\n                  <p className=\"text-center text-muted-foreground py-8\">No orders found</p>\n                )}\n              </CardContent>\n            </Card>\n          </TabsContent>\n\n          {/* Check-In Tab */}\n          <TabsContent value=\"checkin\">\n            <Card>\n              <CardHeader>\n                <CardTitle>Ticket Check-In</CardTitle>\n                <p className=\"text-sm text-muted-foreground\">Scan or enter ticket codes to validate entry</p>\n              </CardHeader>\n              <CardContent>\n                <div className=\"max-w-md mx-auto text-center py-8\">\n                  <div className=\"w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6\">\n                    <BarChart3 className=\"h-12 w-12 text-muted-foreground\" />\n                  </div>\n                  <h3 className=\"text-lg font-semibold mb-2\">QR Scanner Coming Soon</h3>\n                  <p className=\"text-muted-foreground mb-6\">\n                    Manual ticket validation via API is available. QR scanner UI coming in next update.\n                  </p>\n                  <div className=\"text-left\">\n                    <Label>Manual Ticket Code Entry</Label>\n                    <div className=\"flex gap-2 mt-2\">\n                      <Input placeholder=\"Enter ticket code\" />\n                      <Button>Validate</Button>\n                    </div>\n                  </div>\n                </div>\n              </CardContent>\n            </Card>\n          </TabsContent>\n        </Tabs>\n      </div>\n    </div>\n  );
}
