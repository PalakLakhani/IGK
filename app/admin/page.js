'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, Users, DollarSign, BarChart3, Eye, Lock, Plus, Edit2, Trash2, 
  Star, CheckCircle, XCircle, Settings, MessageSquare, RefreshCw, Upload,
  QrCode, Ticket, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    slug: '',
    date: '',
    time: '19:00',
    city: '',
    venue: '',
    category: '',
    description: '',
    poster: '',
    ticketTypes: [],
    desipassUrl: '',
    eventbriteUrl: '',
    status: 'published',
    attendeesCount: 0
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true);
      setError('');
      localStorage.setItem('admin_password', password);
      fetchAllData(password);
    } else {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem('admin_password');
    if (savedPassword) {
      setPassword(savedPassword);
      setAuthenticated(true);
      fetchAllData(savedPassword);
    }
  }, []);

  const fetchAllData = async (pwd) => {
    setLoading(true);
    try {
      // Fetch events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': pwd }
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

      // Fetch testimonials (including pending)
      const testimonialsRes = await fetch('/api/admin/testimonials', {
        headers: { 'x-admin-password': pwd }
      });
      const testimonialsData = await testimonialsRes.json();
      setTestimonials(testimonialsData.testimonials || []);

      // Fetch settings
      const settingsRes = await fetch('/api/admin/settings', {
        headers: { 'x-admin-password': pwd }
      });
      const settingsData = await settingsRes.json();
      setSettings(settingsData.settings || {});
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

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Save event (create or update)
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.city) {
      toast.error('Please fill in required fields (Title, Date, City)');
      return;
    }

    const slug = eventForm.slug || generateSlug(eventForm.title);
    const eventData = { ...eventForm, slug };

    try {
      let res;
      if (editingEvent) {
        res = await fetch(`/api/admin/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-password': password 
          },
          body: JSON.stringify(eventData)
        });
      } else {
        res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-admin-password': password 
          },
          body: JSON.stringify(eventData)
        });
      }

      const data = await res.json();
      
      if (res.ok) {
        toast.success(editingEvent ? 'Event updated!' : 'Event created!');
        setShowEventForm(false);
        resetEventForm();
        fetchAllData(password);
      } else {
        toast.error(data.error || 'Failed to save event');
      }
    } catch (err) {
      toast.error('Error saving event');
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Event deleted');
        fetchAllData(password);
      } else {
        toast.error('Failed to delete event');
      }
    } catch (err) {
      toast.error('Error deleting event');
    }
  };

  // Edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      slug: event.slug || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '19:00',
      city: event.city || '',
      venue: event.venue || '',
      category: event.category || '',
      description: event.description || '',
      poster: event.poster || '',
      ticketTypes: event.ticketTypes || [],
      desipassUrl: event.desipassUrl || '',
      eventbriteUrl: event.eventbriteUrl || '',
      status: event.status || 'published',
      attendeesCount: event.attendeesCount || 0
    });
    setShowEventForm(true);
  };

  // Reset event form
  const resetEventForm = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      slug: '',
      date: '',
      time: '19:00',
      city: '',
      venue: '',
      category: '',
      description: '',
      poster: '',
      ticketTypes: [],
      desipassUrl: '',
      eventbriteUrl: '',
      status: 'published',
      attendeesCount: 0
    });
  };

  // Approve testimonial
  const handleApproveTestimonial = async (id) => {
    try {
      const res = await fetch('/api/admin/testimonials/approve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        toast.success('Testimonial approved!');
        fetchAllData(password);
      } else {
        toast.error('Failed to approve');
      }
    } catch (err) {
      toast.error('Error approving testimonial');
    }
  };

  // Reject testimonial
  const handleRejectTestimonial = async (id) => {
    if (!confirm('Are you sure you want to reject and delete this testimonial?')) return;

    try {
      const res = await fetch('/api/admin/testimonials/reject', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        toast.success('Testimonial rejected');
        fetchAllData(password);
      } else {
        toast.error('Failed to reject');
      }
    } catch (err) {
      toast.error('Error rejecting testimonial');
    }
  };

  // Update settings
  const handleUpdateSettings = async (key, value) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ [key]: value })
      });

      if (res.ok) {
        setSettings({ ...settings, [key]: value });
        toast.success('Setting updated');
      }
    } catch (err) {
      toast.error('Error updating setting');
    }
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
            <CardDescription className="text-center">{siteConfig.name}</CardDescription>
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
              <p className="text-xs text-center text-muted-foreground">Default password: admin123</p>
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
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    pendingTestimonials: testimonials.filter(t => !t.approved).length
  };

  const categories = [
    'Bollywood Night',
    'Concert',
    'Holi',
    'Garba',
    'Navratri',
    'Wedding',
    'Corporate',
    'Cultural',
    'Other'
  ];

  const cities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Stuttgart', 'Düsseldorf'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Badge variant="outline">{siteConfig.name}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => fetchAllData(password)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="testimonials">
              Testimonials
              {stats.pendingTestimonials > 0 && (
                <Badge className="ml-2 bg-red-500">{stats.pendingTestimonials}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                      <p className="text-3xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
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
                    <BarChart3 className="h-8 w-8 text-green-500" />
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
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-3xl font-bold">€{stats.totalRevenue.toFixed(0)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                      <p className="text-3xl font-bold">{stats.pendingTestimonials}</p>
                    </div>
                    <Star className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {events.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.city}
                        </p>
                      </div>
                      <Badge>{event.category}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  {testimonials.filter(t => !t.approved).slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{t.testimonial}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleApproveTestimonial(t.id)}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectTestimonial(t.id)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {testimonials.filter(t => !t.approved).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending reviews</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Button onClick={() => { resetEventForm(); setShowEventForm(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>

            {/* Event Form Dialog */}
            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  <DialogDescription>Fill in the event details below</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Title *</Label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value, slug: generateSlug(e.target.value) })}
                        placeholder="e.g., Holi Bash Berlin 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input
                        value={eventForm.slug}
                        onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                        placeholder="holi-bash-berlin-2025"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City *</Label>
                      <Select value={eventForm.city} onValueChange={(v) => setEventForm({ ...eventForm, city: v })}>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Venue</Label>
                      <Input
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        placeholder="e.g., Columbiahalle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={eventForm.category} onValueChange={(v) => setEventForm({ ...eventForm, category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Poster Image URL</Label>
                    <Input
                      value={eventForm.poster}
                      onChange={(e) => setEventForm({ ...eventForm, poster: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    {eventForm.poster && (
                      <div className="relative h-40 rounded-lg overflow-hidden mt-2">
                        <Image src={eventForm.poster} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Event description..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>DesiPass Ticket URL</Label>
                      <Input
                        value={eventForm.desipassUrl}
                        onChange={(e) => setEventForm({ ...eventForm, desipassUrl: e.target.value })}
                        placeholder="https://desipass.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Eventbrite Ticket URL</Label>
                      <Input
                        value={eventForm.eventbriteUrl}
                        onChange={(e) => setEventForm({ ...eventForm, eventbriteUrl: e.target.value })}
                        placeholder="https://eventbrite.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={eventForm.status} onValueChange={(v) => setEventForm({ ...eventForm, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Attendees Count (for stats)</Label>
                      <Input
                        type="number"
                        value={eventForm.attendeesCount}
                        onChange={(e) => setEventForm({ ...eventForm, attendeesCount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEventForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveEvent}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Events List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : events.length > 0 ? (
                events.map(event => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {event.poster && (
                          <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image src={event.poster} alt={event.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{event.title}</h3>
                            <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-DE', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {event.city} • {event.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No events yet. Create your first event!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Testimonials</h2>
              <Badge variant={stats.pendingTestimonials > 0 ? 'destructive' : 'secondary'}>
                {stats.pendingTestimonials} pending approval
              </Badge>
            </div>

            <div className="space-y-4">
              {testimonials.map(t => (
                <Card key={t.id} className={!t.approved ? 'border-orange-300' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <Badge variant={t.approved ? 'default' : 'outline'}>
                            {t.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">"{t.testimonial}"</p>
                        <p className="text-sm text-muted-foreground">
                          — {t.name} ({t.city || 'Unknown'}) • {t.eventAttended}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!t.approved && (
                          <Button size="sm" variant="outline" onClick={() => handleApproveTestimonial(t.id)}>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Approve
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleRejectTestimonial(t.id)}>
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />
                          {t.approved ? 'Remove' : 'Reject'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {testimonials.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No testimonials yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-2xl font-bold mb-6">Orders & Tickets</h2>
            
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{order.orderId}</p>
                          <p className="text-sm">{order.name} • {order.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity}x {order.ticketType} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl">€{order.totalAmount || 0}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
            
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Moderation</CardTitle>
                  <CardDescription>Control whether testimonials require approval before being displayed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Approval</p>
                      <p className="text-sm text-muted-foreground">New testimonials must be approved by admin</p>
                    </div>
                    <Switch
                      checked={settings.moderateRatings !== false}
                      onCheckedChange={(checked) => handleUpdateSettings('moderateRatings', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Attendees Count</CardTitle>
                  <CardDescription>Base number added to dynamic attendee count for stats display</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={settings.totalAttendeesManual || 25000}
                      onChange={(e) => setSettings({ ...settings, totalAttendeesManual: parseInt(e.target.value) || 0 })}
                      className="max-w-[200px]"
                    />
                    <Button onClick={() => handleUpdateSettings('totalAttendeesManual', settings.totalAttendeesManual)}>
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
