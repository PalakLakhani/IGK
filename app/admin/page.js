'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, Users, DollarSign, BarChart3, Eye, Lock, Plus, Edit2, Trash2, 
  Star, CheckCircle, XCircle, Settings, RefreshCw, Ticket, Save, UserPlus
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', slug: '', date: '', time: '19:00', city: '', venue: '', category: '',
    description: '', poster: '', ticketTypes: [], desipassUrl: '', eventbriteUrl: '',
    status: 'published', attendeesCount: 0
  });

  // Team member form state
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '', designation: '', role: '', image: '', linkedin: '', instagram: '',
    bio: '', city: '', type: 'city', order: 0
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
      const [eventsRes, ordersRes, testimonialsRes, settingsRes, teamRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/admin/orders', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/testimonials', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/settings', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/team', { headers: { 'x-admin-password': pwd } })
      ]);

      const eventsData = await eventsRes.json();
      const ordersData = await ordersRes.json();
      const testimonialsData = await testimonialsRes.json();
      const settingsData = await settingsRes.json();
      const teamData = await teamRes.json();

      setEvents(eventsData.events || []);
      setOrders(ordersData.orders || []);
      setTestimonials(testimonialsData.testimonials || []);
      setSettings(settingsData.settings || {});
      setTeamMembers(teamData.members || []);
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

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Event handlers
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.city) {
      toast.error('Please fill in required fields');
      return;
    }
    const slug = eventForm.slug || generateSlug(eventForm.title);
    const eventData = { ...eventForm, slug };
    try {
      const res = editingEvent
        ? await fetch(`/api/admin/events/${editingEvent.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify(eventData) })
        : await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify(eventData) });
      if (res.ok) {
        toast.success(editingEvent ? 'Event updated!' : 'Event created!');
        setShowEventForm(false);
        resetEventForm();
        fetchAllData(password);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) { toast.error('Error saving event'); }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      if (res.ok) { toast.success('Event deleted'); fetchAllData(password); }
    } catch (err) { toast.error('Error deleting'); }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '', slug: event.slug || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || '19:00', city: event.city || '', venue: event.venue || '',
      category: event.category || '', description: event.description || '',
      poster: event.poster || '', ticketTypes: event.ticketTypes || [],
      desipassUrl: event.desipassUrl || '', eventbriteUrl: event.eventbriteUrl || '',
      status: event.status || 'published', attendeesCount: event.attendeesCount || 0
    });
    setShowEventForm(true);
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventForm({ title: '', slug: '', date: '', time: '19:00', city: '', venue: '', category: '', description: '', poster: '', ticketTypes: [], desipassUrl: '', eventbriteUrl: '', status: 'published', attendeesCount: 0 });
  };

  // Team handlers
  const handleSaveTeamMember = async () => {
    if (!teamForm.name) { toast.error('Name is required'); return; }
    try {
      const res = editingMember
        ? await fetch(`/api/admin/team/${editingMember.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify(teamForm) })
        : await fetch('/api/admin/team', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify(teamForm) });
      if (res.ok) {
        toast.success(editingMember ? 'Member updated!' : 'Member added!');
        setShowTeamForm(false);
        resetTeamForm();
        fetchAllData(password);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) { toast.error('Error saving member'); }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (!confirm('Delete this team member?')) return;
    try {
      const res = await fetch(`/api/admin/team/${memberId}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      if (res.ok) { toast.success('Member deleted'); fetchAllData(password); }
    } catch (err) { toast.error('Error deleting'); }
  };

  const handleEditTeamMember = (member) => {
    setEditingMember(member);
    setTeamForm({
      name: member.name || '', designation: member.designation || '', role: member.role || '',
      image: member.image || '', linkedin: member.linkedin || '', instagram: member.instagram || '',
      bio: member.bio || '', city: member.city || '', type: member.type || 'city', order: member.order || 0
    });
    setShowTeamForm(true);
  };

  const resetTeamForm = () => {
    setEditingMember(null);
    setTeamForm({ name: '', designation: '', role: '', image: '', linkedin: '', instagram: '', bio: '', city: '', type: 'city', order: 0 });
  };

  // Testimonial handlers
  const handleApproveTestimonial = async (id) => {
    try {
      const res = await fetch('/api/admin/testimonials/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ id }) });
      if (res.ok) { toast.success('Approved!'); fetchAllData(password); }
    } catch (err) { toast.error('Error'); }
  };

  const handleRejectTestimonial = async (id) => {
    if (!confirm('Reject and delete?')) return;
    try {
      const res = await fetch('/api/admin/testimonials/reject', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ id }) });
      if (res.ok) { toast.success('Rejected'); fetchAllData(password); }
    } catch (err) { toast.error('Error'); }
  };

  const handleUpdateSettings = async (key, value) => {
    try {
      const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, body: JSON.stringify({ [key]: value }) });
      if (res.ok) { setSettings({ ...settings, [key]: value }); toast.success('Updated'); }
    } catch (err) { toast.error('Error'); }
  };

  // Seed team
  const handleSeedTeam = async () => {
    try {
      const res = await fetch('/api/seed-team');
      const data = await res.json();
      toast.success(data.message);
      fetchAllData(password);
    } catch (err) { toast.error('Error seeding team'); }
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
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter admin password" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Login</Button>
              <p className="text-xs text-center text-muted-foreground">Default: admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    pendingTestimonials: testimonials.filter(t => !t.approved).length,
    totalTeamMembers: teamMembers.length
  };

  const categories = ['Bollywood Night', 'Concert', 'Holi', 'Garba', 'Navratri', 'Wedding', 'Corporate', 'Cultural', 'Other'];
  const cities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Stuttgart', 'Düsseldorf'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Badge variant="outline">{siteConfig.name}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchAllData(password)}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/')}><Eye className="mr-2 h-4 w-4" />View Site</Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="testimonials">Reviews {stats.pendingTestimonials > 0 && <Badge className="ml-2 bg-red-500">{stats.pendingTestimonials}</Badge>}</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Events</p><p className="text-3xl font-bold">{stats.totalEvents}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-3xl font-bold">{stats.upcomingEvents}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Orders</p><p className="text-3xl font-bold">{stats.totalOrders}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Revenue</p><p className="text-3xl font-bold">€{stats.totalRevenue}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending Reviews</p><p className="text-3xl font-bold">{stats.pendingTestimonials}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Team Members</p><p className="text-3xl font-bold">{stats.totalTeamMembers}</p></CardContent></Card>
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Button onClick={() => { resetEventForm(); setShowEventForm(true); }}><Plus className="mr-2 h-4 w-4" />Add Event</Button>
            </div>

            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Title *</Label><Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Event title" /></div>
                    <div><Label>Slug</Label><Input value={eventForm.slug} onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Date *</Label><Input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} /></div>
                    <div><Label>Time</Label><Input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} /></div>
                    <div><Label>City *</Label><Select value={eventForm.city} onValueChange={(v) => setEventForm({ ...eventForm, city: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Venue</Label><Input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} /></div>
                    <div><Label>Category</Label><Select value={eventForm.category} onValueChange={(v) => setEventForm({ ...eventForm, category: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div><Label>Poster URL</Label><Input value={eventForm.poster} onChange={(e) => setEventForm({ ...eventForm, poster: e.target.value })} placeholder="https://..." />{eventForm.poster && <div className="relative h-32 mt-2 rounded overflow-hidden"><Image src={eventForm.poster} alt="Preview" fill className="object-cover" /></div>}</div>
                  <div><Label>Description</Label><Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} rows={3} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>DesiPass URL</Label><Input value={eventForm.desipassUrl} onChange={(e) => setEventForm({ ...eventForm, desipassUrl: e.target.value })} /></div>
                    <div><Label>Eventbrite URL</Label><Input value={eventForm.eventbriteUrl} onChange={(e) => setEventForm({ ...eventForm, eventbriteUrl: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Status</Label><Select value={eventForm.status} onValueChange={(v) => setEventForm({ ...eventForm, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem></SelectContent></Select></div>
                    <div><Label>Attendees</Label><Input type="number" value={eventForm.attendeesCount} onChange={(e) => setEventForm({ ...eventForm, attendeesCount: parseInt(e.target.value) || 0 })} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEventForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveEvent}><Save className="mr-2 h-4 w-4" />{editingEvent ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {events.map(event => (
                <Card key={event.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {event.poster && <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0"><Image src={event.poster} alt="" fill className="object-cover" /></div>}
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><h3 className="font-bold">{event.title}</h3><Badge variant={event.status === 'published' ? 'default' : 'secondary'}>{event.status}</Badge></div>
                      <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.city} • {event.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {events.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No events yet</CardContent></Card>}
            </div>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Team</h2>
              <div className="flex gap-2">
                {teamMembers.length === 0 && <Button variant="outline" onClick={handleSeedTeam}>Seed Sample Team</Button>}
                <Button onClick={() => { resetTeamForm(); setShowTeamForm(true); }}><UserPlus className="mr-2 h-4 w-4" />Add Member</Button>
              </div>
            </div>

            <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Full name" /></div>
                    <div><Label>Type</Label><Select value={teamForm.type} onValueChange={(v) => setTeamForm({ ...teamForm, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="leadership">Leadership</SelectItem><SelectItem value="city">City Team</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>{teamForm.type === 'leadership' ? 'Designation' : 'Role'}</Label><Input value={teamForm.type === 'leadership' ? teamForm.designation : teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, [teamForm.type === 'leadership' ? 'designation' : 'role']: e.target.value })} placeholder={teamForm.type === 'leadership' ? 'CEO, Head of Marketing...' : 'City Lead, Coordinator...'} /></div>
                    <div><Label>City</Label><Select value={teamForm.city} onValueChange={(v) => setTeamForm({ ...teamForm, city: v })}><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger><SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <div><Label>Photo URL</Label><Input value={teamForm.image} onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })} placeholder="https://..." />{teamForm.image && <div className="relative h-24 w-24 mt-2 rounded-full overflow-hidden mx-auto"><Image src={teamForm.image} alt="" fill className="object-cover" /></div>}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>LinkedIn</Label><Input value={teamForm.linkedin} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
                    <div><Label>Instagram</Label><Input value={teamForm.instagram} onChange={(e) => setTeamForm({ ...teamForm, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
                  </div>
                  {teamForm.type === 'leadership' && <div><Label>Bio</Label><Textarea value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} rows={2} placeholder="Short bio..." /></div>}
                  <div><Label>Display Order</Label><Input type="number" value={teamForm.order} onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowTeamForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveTeamMember}><Save className="mr-2 h-4 w-4" />{editingMember ? 'Update' : 'Add'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Leadership Team */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Leadership Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.filter(m => m.type === 'leadership').map(member => (
                  <Card key={member.id}>
                    <CardContent className="p-4 text-center">
                      {member.image && <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3"><Image src={member.image} alt="" fill className="object-cover" /></div>}
                      <h4 className="font-bold">{member.name}</h4>
                      <p className="text-sm text-pink-600">{member.designation}</p>
                      <div className="flex gap-2 justify-center mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleEditTeamMember(member)}><Edit2 className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteTeamMember(member.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {teamMembers.filter(m => m.type === 'leadership').length === 0 && <p className="text-muted-foreground">No leadership team members</p>}
            </div>

            {/* City Teams */}
            <div>
              <h3 className="text-lg font-semibold mb-4">City Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.filter(m => m.type === 'city').map(member => (
                  <Card key={member.id}>
                    <CardContent className="p-4 text-center">
                      {member.image && <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-2"><Image src={member.image} alt="" fill className="object-cover" /></div>}
                      <h4 className="font-bold text-sm">{member.name}</h4>
                      <p className="text-xs text-pink-600">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.city}</p>
                      <div className="flex gap-2 justify-center mt-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditTeamMember(member)}><Edit2 className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTeamMember(member.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {teamMembers.filter(m => m.type === 'city').length === 0 && <p className="text-muted-foreground">No city team members</p>}
            </div>
          </TabsContent>

          {/* Testimonials */}
          <TabsContent value="testimonials">
            <h2 className="text-2xl font-bold mb-6">Manage Reviews</h2>
            <div className="space-y-4">
              {testimonials.map(t => (
                <Card key={t.id} className={!t.approved ? 'border-orange-300' : ''}>
                  <CardContent className="p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
                      <p className="text-gray-700 mb-2">"{t.testimonial}"</p>
                      <p className="text-sm text-muted-foreground">— {t.name} • {t.eventAttended}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant={t.approved ? 'default' : 'outline'}>{t.approved ? 'Approved' : 'Pending'}</Badge>
                      {!t.approved && <Button size="sm" variant="outline" onClick={() => handleApproveTestimonial(t.id)}><CheckCircle className="h-4 w-4 text-green-500" /></Button>}
                      <Button size="sm" variant="outline" onClick={() => handleRejectTestimonial(t.id)}><XCircle className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {testimonials.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No reviews yet</CardContent></Card>}
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold">{order.orderId}</p>
                        <p className="text-sm">{order.name} • {order.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">€{order.totalAmount || 0}</p>
                        <Badge>{order.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : <Card><CardContent className="py-12 text-center text-muted-foreground">No orders yet</CardContent></Card>}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="grid gap-6 max-w-2xl">
              <Card>
                <CardHeader><CardTitle>Rating Moderation</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium">Require Approval</p><p className="text-sm text-muted-foreground">New reviews must be approved</p></div>
                    <Switch checked={settings.moderateRatings !== false} onCheckedChange={(checked) => handleUpdateSettings('moderateRatings', checked)} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Manual Attendees Count</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input type="number" value={settings.totalAttendeesManual || 25000} onChange={(e) => setSettings({ ...settings, totalAttendeesManual: parseInt(e.target.value) || 0 })} className="max-w-[200px]" />
                    <Button onClick={() => handleUpdateSettings('totalAttendeesManual', settings.totalAttendeesManual)}>Save</Button>
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
