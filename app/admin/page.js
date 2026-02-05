'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { 
  Calendar, Users, DollarSign, BarChart3, Eye, Lock, Plus, Edit2, Trash2, 
  Star, CheckCircle, XCircle, Settings, RefreshCw, Ticket, Save, UserPlus,
  Upload, Clock, MapPin, ExternalLink, AlertCircle, ZoomIn, ZoomOut, Move
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

// Helper function to create cropped image
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Set canvas size to the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}

// Helper function to generate excerpt from description (same as used in EventCard)
function generateExcerpt(description, maxLength = 140) {
  if (!description) return '';
  
  // Strip HTML tags
  let text = description.replace(/<[^>]*>/g, '');
  
  // Strip common emojis
  text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]/gu, '');
  
  // Clean up multiple spaces
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate
  if (text.length <= maxLength) return text;
  
  // Cut at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

export default function AdminPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const teamFileInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingTeamPhoto, setUploadingTeamPhoto] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Photo cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // Event form state - Updated schema with new content fields
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    slug: '',
    startDate: '', // YYYY-MM-DD
    startTime: '19:00', // HH:MM
    endDate: '', // Optional
    endTime: '', // Optional
    city: '',
    venue: '',
    venueAddress: '',
    category: '',
    brand: 'IGK',
    // Content fields
    heroTagline: '', // Max 140 chars - homepage hero only
    shortSummary: '', // Max 220 chars - event cards
    description: '', // Full description - event detail page only
    poster: '', // URL or uploaded path
    coverImagePath: '', // Uploaded file path
    desipassUrl: '',
    eventbriteUrl: '',
    googleMapsUrl: '',
    status: 'published',
    statusOverride: 'auto',
    attendeesCount: 0,
    featured: false,
    // Arrays for optional sections
    rules: [],
    schedule: [],
    faqs: []
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
        fetch('/api/events?type=classified'),
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

      // Combine upcoming and past events
      const allEvents = [...(eventsData.upcoming || []), ...(eventsData.past || [])];
      setEvents(allEvents);
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

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'events');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setEventForm({ 
          ...eventForm, 
          poster: data.path,
          coverImagePath: data.path 
        });
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Team photo select handler - opens cropper
  const handleTeamPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setCropImage(imageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropper(true);
  };

  // Cropper callback
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Save cropped image
  const handleSaveCroppedImage = async () => {
    if (!cropImage || !croppedAreaPixels) return;

    setUploadingTeamPhoto(true);
    try {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      if (!croppedBlob) {
        toast.error('Failed to crop image');
        return;
      }

      const formData = new FormData();
      formData.append('file', croppedBlob, 'profile.jpg');
      formData.append('type', 'team');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setTeamForm({ ...teamForm, image: data.path });
        toast.success('Photo cropped and uploaded!');
        setShowCropper(false);
        setCropImage(null);
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Failed to save cropped image');
    } finally {
      setUploadingTeamPhoto(false);
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setShowCropper(false);
    setCropImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (teamFileInputRef.current) teamFileInputRef.current.value = '';
  };

  // Legacy team photo upload handler (direct upload without crop)
  const handleTeamPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTeamPhoto(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'team');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setTeamForm({ ...teamForm, image: data.path });
        toast.success('Photo uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploadingTeamPhoto(false);
    }
  };

  // Event handlers
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.startDate || !eventForm.city) {
      toast.error('Please fill in required fields (Title, Start Date, City)');
      return;
    }

    const slug = eventForm.slug || generateSlug(eventForm.title);
    
    // Build startDateTime
    const startDateTime = new Date(`${eventForm.startDate}T${eventForm.startTime || '19:00'}:00`);
    
    // Build endDateTime if provided
    let endDateTime = null;
    if (eventForm.endDate) {
      endDateTime = new Date(`${eventForm.endDate}T${eventForm.endTime || '23:59'}:00`);
    }

    const eventData = {
      title: eventForm.title,
      slug,
      // Content fields
      heroTagline: eventForm.heroTagline || '',
      shortSummary: eventForm.shortSummary || '',
      description: eventForm.description || '',
      // Location
      city: eventForm.city,
      venue: eventForm.venue || '',
      venueAddress: eventForm.venueAddress || '',
      googleMapsUrl: eventForm.googleMapsUrl || '',
      category: eventForm.category,
      brand: eventForm.brand,
      // Date/Time
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime ? endDateTime.toISOString() : null,
      date: startDateTime.toISOString(),
      time: eventForm.startTime,
      endTime: eventForm.endTime,
      // Media
      poster: eventForm.poster || eventForm.coverImagePath,
      coverImagePath: eventForm.coverImagePath,
      coverImageUrl: eventForm.poster,
      // Ticketing
      desipassUrl: eventForm.desipassUrl,
      eventbriteUrl: eventForm.eventbriteUrl,
      ticketPlatforms: {
        desipassUrl: eventForm.desipassUrl,
        eventbriteUrl: eventForm.eventbriteUrl
      },
      // Status
      status: eventForm.status,
      statusOverride: eventForm.statusOverride,
      attendeesCount: eventForm.attendeesCount,
      featured: eventForm.featured,
      // Optional sections
      rules: eventForm.rules || [],
      schedule: eventForm.schedule || [],
      faqs: eventForm.faqs || []
    };

    try {
      const res = editingEvent
        ? await fetch(`/api/admin/events/${editingEvent.id}`, { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, 
            body: JSON.stringify(eventData) 
          })
        : await fetch('/api/admin/events', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'x-admin-password': password }, 
            body: JSON.stringify(eventData) 
          });

      if (res.ok) {
        toast.success(editingEvent ? 'Event updated!' : 'Event created!');
        setShowEventForm(false);
        resetEventForm();
        fetchAllData(password);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) { 
      toast.error('Error saving event'); 
    }
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
    
    // Parse dates
    let startDate = '';
    let startTime = '19:00';
    let endDate = '';
    let endTime = '';
    
    if (event.startDateTime || event.date) {
      const dt = new Date(event.startDateTime || event.date);
      startDate = dt.toISOString().split('T')[0];
      startTime = dt.toTimeString().slice(0, 5);
    }
    
    if (event.endDateTime) {
      const dt = new Date(event.endDateTime);
      endDate = dt.toISOString().split('T')[0];
      endTime = dt.toTimeString().slice(0, 5);
    }

    setEventForm({
      title: event.title || '',
      slug: event.slug || '',
      startDate,
      startTime,
      endDate,
      endTime,
      city: event.city || '',
      venue: event.venue || '',
      category: event.category || '',
      brand: event.brand || 'IGK',
      description: event.description || '',
      poster: event.poster || event.coverImageUrl || '',
      coverImagePath: event.coverImagePath || '',
      desipassUrl: event.desipassUrl || event.ticketPlatforms?.desipassUrl || '',
      eventbriteUrl: event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl || '',
      status: event.status || 'published',
      statusOverride: event.statusOverride || 'auto',
      attendeesCount: event.attendeesCount || 0,
      featured: event.featured || false
    });
    setShowEventForm(true);
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventForm({
      title: '', slug: '', startDate: '', startTime: '19:00', endDate: '', endTime: '',
      city: '', venue: '', category: '', brand: 'IGK', description: '', poster: '',
      coverImagePath: '', desipassUrl: '', eventbriteUrl: '', status: 'published',
      statusOverride: 'auto', attendeesCount: 0, featured: false
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    if (teamFileInputRef.current) teamFileInputRef.current.value = '';
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

  const handleSeedTeam = async () => {
    try {
      const res = await fetch('/api/seed-team');
      const data = await res.json();
      toast.success(data.message);
      fetchAllData(password);
    } catch (err) { toast.error('Error seeding team'); }
  };

  // Migrate events to new schema
  const handleMigrateEvents = async () => {
    try {
      const res = await fetch('/api/events/migrate');
      const data = await res.json();
      toast.success(`Migration complete: ${data.migrated} events updated`);
      fetchAllData(password);
    } catch (err) { toast.error('Migration failed'); }
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

  // Calculate stats with proper classification
  const upcomingEvents = events.filter(e => e.classification === 'upcoming');
  const pastEvents = events.filter(e => e.classification === 'past');
  
  const stats = {
    totalEvents: events.length,
    upcomingEvents: upcomingEvents.length,
    pastEvents: pastEvents.length,
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    pendingTestimonials: testimonials.filter(t => !t.approved).length,
    totalTeamMembers: teamMembers.length
  };

  const categories = ['Bollywood Night', 'Concert', 'Holi', 'Garba', 'Navratri', 'Wedding', 'Corporate', 'Cultural', 'Other'];
  const cities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Stuttgart', 'Düsseldorf'];
  const brands = ['IGK', 'BIG', 'Holi Bash Europe', 'Navaratri Fiesta Europe'];

  // Helper to format event date for display
  const formatEventDate = (event) => {
    try {
      const date = new Date(event.startDateTime || event.date);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Events</p><p className="text-3xl font-bold">{stats.totalEvents}</p></CardContent></Card>
              <Card className="border-green-200"><CardContent className="pt-6"><p className="text-sm text-green-600">Upcoming</p><p className="text-3xl font-bold text-green-600">{stats.upcomingEvents}</p></CardContent></Card>
              <Card className="border-gray-200"><CardContent className="pt-6"><p className="text-sm text-gray-500">Past</p><p className="text-3xl font-bold text-gray-500">{stats.pastEvents}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Orders</p><p className="text-3xl font-bold">{stats.totalOrders}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Revenue</p><p className="text-3xl font-bold">€{stats.totalRevenue}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending Reviews</p><p className="text-3xl font-bold">{stats.pendingTestimonials}</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Team Members</p><p className="text-3xl font-bold">{stats.totalTeamMembers}</p></CardContent></Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => { resetEventForm(); setShowEventForm(true); }}><Plus className="mr-2 h-4 w-4" />Add Event</Button>
                <Button variant="outline" onClick={handleMigrateEvents}>Migrate Events to New Schema</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Button onClick={() => { resetEventForm(); setShowEventForm(true); }}><Plus className="mr-2 h-4 w-4" />Add Event</Button>
            </div>

            {/* Event Form Dialog */}
            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
                  <DialogDescription>All times are in Europe/Berlin timezone</DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title *</Label>
                      <Input 
                        value={eventForm.title} 
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value, slug: generateSlug(e.target.value) })} 
                        placeholder="Event title" 
                      />
                    </div>
                    <div>
                      <Label>Slug</Label>
                      <Input value={eventForm.slug} onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })} />
                    </div>
                  </div>

                  {/* Date & Time - Start */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Start Date * <span className="text-xs text-muted-foreground">(Europe/Berlin)</span>
                      </Label>
                      <Input 
                        type="date" 
                        value={eventForm.startDate} 
                        onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })} 
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Start Time
                      </Label>
                      <Input 
                        type="time" 
                        value={eventForm.startTime} 
                        onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Date & Time - End (Optional) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        End Date <span className="text-xs text-muted-foreground">(Optional)</span>
                      </Label>
                      <Input 
                        type="date" 
                        value={eventForm.endDate} 
                        onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })} 
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input 
                        type="time" 
                        value={eventForm.endTime} 
                        onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City *</Label>
                      <Select value={eventForm.city} onValueChange={(v) => setEventForm({ ...eventForm, city: v })}>
                        <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Venue</Label>
                      <Input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} placeholder="Venue name" />
                    </div>
                  </div>

                  {/* Category & Brand */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={eventForm.category} onValueChange={(v) => setEventForm({ ...eventForm, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Brand</Label>
                      <Select value={eventForm.brand} onValueChange={(v) => setEventForm({ ...eventForm, brand: v })}>
                        <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                        <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4" />
                      Cover Image
                    </Label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Upload from computer (max 5MB)</p>
                      </div>
                      <div className="flex-1">
                        <Input 
                          value={eventForm.poster} 
                          onChange={(e) => setEventForm({ ...eventForm, poster: e.target.value })} 
                          placeholder="Or paste image URL"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Or use external URL</p>
                      </div>
                    </div>
                    {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                    {(eventForm.poster || eventForm.coverImagePath) && (
                      <div className="relative h-40 mt-3 rounded overflow-hidden border">
                        <Image 
                          src={eventForm.coverImagePath || eventForm.poster} 
                          alt="Preview" 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Description with Excerpt Preview */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={eventForm.description} 
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} 
                      rows={4} 
                      placeholder="Event description... (this will appear on the event detail page)"
                    />
                    
                    {/* Excerpt Preview */}
                    {eventForm.description && (
                      <div className="bg-gray-50 border rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-xs font-semibold text-gray-500 uppercase">Card Excerpt Preview</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {generateExcerpt(eventForm.description, 140)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {generateExcerpt(eventForm.description, 140).length} / 140 characters (shown on homepage & events page cards)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ticket Platform URLs */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <Label className="flex items-center gap-2 mb-3 text-blue-800">
                      <ExternalLink className="h-4 w-4" />
                      Ticket Platform Links
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">DesiPass URL</Label>
                        <Input 
                          value={eventForm.desipassUrl} 
                          onChange={(e) => setEventForm({ ...eventForm, desipassUrl: e.target.value })} 
                          placeholder="https://desipass.com/..."
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Eventbrite URL</Label>
                        <Input 
                          value={eventForm.eventbriteUrl} 
                          onChange={(e) => setEventForm({ ...eventForm, eventbriteUrl: e.target.value })} 
                          placeholder="https://eventbrite.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status & Settings */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={eventForm.status} onValueChange={(v) => setEventForm({ ...eventForm, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Classification Override</Label>
                      <Select value={eventForm.statusOverride} onValueChange={(v) => setEventForm({ ...eventForm, statusOverride: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto (Based on Date)</SelectItem>
                          <SelectItem value="upcoming">Force Upcoming</SelectItem>
                          <SelectItem value="past">Force Past</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Attendees Count</Label>
                      <Input 
                        type="number" 
                        value={eventForm.attendeesCount} 
                        onChange={(e) => setEventForm({ ...eventForm, attendeesCount: parseInt(e.target.value) || 0 })} 
                      />
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={eventForm.featured} 
                      onCheckedChange={(checked) => setEventForm({ ...eventForm, featured: checked })} 
                    />
                    <Label>Featured Event (shows in homepage hero)</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEventForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveEvent}><Save className="mr-2 h-4 w-4" />{editingEvent ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Events List - Split by classification */}
            <div className="space-y-8">
              {/* Upcoming Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Badge className="bg-green-500">Upcoming</Badge>
                  <span className="text-muted-foreground">({upcomingEvents.length})</span>
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4 flex items-center gap-4">
                        {(event.poster || event.coverImagePath) && (
                          <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                            <Image src={event.coverImagePath || event.poster} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{event.title}</h3>
                            <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>{event.status}</Badge>
                            {event.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(event)} • {event.city} • {event.category}
                          </p>
                          {(event.desipassUrl || event.eventbriteUrl) && (
                            <div className="flex gap-2 mt-1">
                              {event.desipassUrl && <Badge variant="outline" className="text-xs">DesiPass</Badge>}
                              {event.eventbriteUrl && <Badge variant="outline" className="text-xs">Eventbrite</Badge>}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}><Edit2 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No upcoming events. Create one to get started!
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Past Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Badge variant="secondary">Past</Badge>
                  <span className="text-muted-foreground">({pastEvents.length})</span>
                </h3>
                <div className="space-y-3">
                  {pastEvents.slice(0, 10).map(event => (
                    <Card key={event.id} className="border-l-4 border-l-gray-300 opacity-75">
                      <CardContent className="p-4 flex items-center gap-4">
                        {(event.poster || event.coverImagePath) && (
                          <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0 grayscale">
                            <Image src={event.coverImagePath || event.poster} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(event)} • {event.city}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}><Edit2 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {pastEvents.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No past events</p>
                  )}
                </div>
              </div>
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
                  
                  {/* Photo Upload Section */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Profile Photo
                    </Label>
                    
                    {/* File Upload */}
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
                      <Input 
                        ref={teamFileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleTeamPhotoSelect}
                        disabled={uploadingTeamPhoto}
                        className="hidden"
                        id="team-photo-upload"
                      />
                      <label htmlFor="team-photo-upload" className="cursor-pointer">
                        {uploadingTeamPhoto ? (
                          <div className="flex items-center justify-center gap-2 text-pink-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600">Click to upload photo</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Preview */}
                    {teamForm.image && (
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-pink-500">
                          <Image src={teamForm.image} alt="Preview" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-600">Photo uploaded!</p>
                          <p className="text-xs text-gray-500 truncate">{teamForm.image}</p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 mt-1 h-7 px-2"
                            onClick={() => {
                              setTeamForm({ ...teamForm, image: '' });
                              if (teamFileInputRef.current) teamFileInputRef.current.value = '';
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

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

            {/* Photo Cropper Dialog */}
            <Dialog open={showCropper} onOpenChange={(open) => !open && handleCancelCrop()}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Move className="h-5 w-5" />
                    Adjust Photo
                  </DialogTitle>
                  <DialogDescription>
                    Drag to reposition, use slider to zoom in/out
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Cropper Area */}
                  <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
                    {cropImage && (
                      <Cropper
                        image={cropImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    )}
                  </div>

                  {/* Zoom Control */}
                  <div className="flex items-center gap-4 px-4">
                    <ZoomOut className="h-5 w-5 text-gray-500" />
                    <Slider
                      value={[zoom]}
                      min={1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => setZoom(value[0])}
                      className="flex-1"
                    />
                    <ZoomIn className="h-5 w-5 text-gray-500" />
                  </div>

                  <p className="text-sm text-center text-muted-foreground">
                    Tip: Drag the image to center your face in the circle
                  </p>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={handleCancelCrop}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveCroppedImage} 
                    disabled={uploadingTeamPhoto}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {uploadingTeamPhoto ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Photo
                      </>
                    )}
                  </Button>
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
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
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
              <Card>
                <CardHeader><CardTitle>Data Migration</CardTitle></CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={handleMigrateEvents}>
                    Migrate Events to New Schema
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Updates all events to use the new unified schema with proper date/time handling.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
