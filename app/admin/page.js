'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { 
  Calendar, Users, DollarSign, BarChart3, Eye, Lock, Plus, Edit2, Trash2, 
  Star, CheckCircle, XCircle, Settings, RefreshCw, Ticket, Save, UserPlus,
  Upload, Clock, MapPin, ExternalLink, AlertCircle, ZoomIn, ZoomOut, Move,
  Mail, Image as ImageIcon, Download, X, ImagePlus
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
  const galleryInputRef = useRef(null);
  const brandLogoInputRef = useRef(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
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
  
  // Gallery uploading state (free-flow, not event-wise)
  const [galleryUploading, setGalleryUploading] = useState(false);
  
  // Event gallery management state
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [selectedEventForGallery, setSelectedEventForGallery] = useState(null);
  
  // Brand form state
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({ name: '', logoUrl: '', websiteUrl: '', order: 0 });
  const [brandUploading, setBrandUploading] = useState(false);
  
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
      const [eventsRes, testimonialsRes, settingsRes, teamRes, newsletterRes, partnersRes, contactsRes, brandsRes, galleryRes] = await Promise.all([
        fetch('/api/events?type=classified'),
        fetch('/api/admin/testimonials', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/settings', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/team', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/newsletter', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/partners', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/contacts', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/brands', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/admin/gallery', { headers: { 'x-admin-password': pwd } })
      ]);

      const eventsData = await eventsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const settingsData = await settingsRes.json();
      const teamData = await teamRes.json();
      const newsletterData = await newsletterRes.json();
      const partnersData = await partnersRes.json();
      const contactsData = await contactsRes.json();
      const brandsData = await brandsRes.json();
      const galleryData = await galleryRes.json();

      // Combine upcoming and past events
      const allEvents = [...(eventsData.upcoming || []), ...(eventsData.past || [])];
      setEvents(allEvents);
      setTestimonials(testimonialsData.testimonials || []);
      setSettings(settingsData.settings || {});
      setTeamMembers(teamData.members || []);
      setNewsletterSubscribers(newsletterData.subscribers || []);
      setPartners(partnersData.partners || []);
      setContacts(contactsData.contacts || []);
      setBrands(brandsData.brands || []);
      setGalleryPhotos(galleryData.photos || []);
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
      venueAddress: event.venueAddress || '',
      category: event.category || '',
      brand: event.brand || 'IGK',
      // Content fields
      heroTagline: event.heroTagline || '',
      shortSummary: event.shortSummary || '',
      description: event.description || '',
      poster: event.poster || event.coverImageUrl || '',
      coverImagePath: event.coverImagePath || '',
      desipassUrl: event.desipassUrl || event.ticketPlatforms?.desipassUrl || '',
      eventbriteUrl: event.eventbriteUrl || event.ticketPlatforms?.eventbriteUrl || '',
      googleMapsUrl: event.googleMapsUrl || '',
      status: event.status || 'published',
      statusOverride: event.statusOverride || 'auto',
      attendeesCount: event.attendeesCount || 0,
      featured: event.featured || false,
      rules: event.rules || [],
      schedule: event.schedule || [],
      faqs: event.faqs || []
    });
    setShowEventForm(true);
  };

  const resetEventForm = () => {
    setEditingEvent(null);
    setEventForm({
      title: '', slug: '', startDate: '', startTime: '19:00', endDate: '', endTime: '',
      city: '', venue: '', venueAddress: '', category: '', brand: 'IGK', 
      heroTagline: '', shortSummary: '', description: '', poster: '',
      coverImagePath: '', desipassUrl: '', eventbriteUrl: '', googleMapsUrl: '', 
      status: 'published', statusOverride: 'auto', attendeesCount: 0, featured: false,
      rules: [], schedule: [], faqs: []
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

  // Gallery handlers
  const handleOpenGalleryManager = (event) => {
    setSelectedEventForGallery(event);
    setShowGalleryManager(true);
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    const uploadedPaths = [];

    try {
      // Upload each file
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'gallery');

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: formData
        });

        const data = await res.json();
        if (res.ok) {
          uploadedPaths.push(data.path);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedPaths.length > 0) {
        // Update event gallery
        const updatedGallery = [...(selectedEventForGallery.gallery || []), ...uploadedPaths];
        
        const res = await fetch(`/api/admin/events/${selectedEventForGallery.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json', 
            'x-admin-password': password 
          },
          body: JSON.stringify({ 
            ...selectedEventForGallery,
            gallery: updatedGallery 
          })
        });

        if (res.ok) {
          toast.success(`${uploadedPaths.length} photo(s) added to gallery!`);
          // Update local state
          setSelectedEventForGallery({
            ...selectedEventForGallery,
            gallery: updatedGallery
          });
          fetchAllData(password);
        }
      }
    } catch (err) {
      toast.error('Error uploading photos');
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleRemoveFromGallery = async (photoPath) => {
    if (!confirm('Remove this photo from gallery?')) return;
    
    const updatedGallery = selectedEventForGallery.gallery.filter(p => p !== photoPath);
    
    try {
      const res = await fetch(`/api/admin/events/${selectedEventForGallery.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'x-admin-password': password 
        },
        body: JSON.stringify({ 
          ...selectedEventForGallery,
          gallery: updatedGallery 
        })
      });

      if (res.ok) {
        toast.success('Photo removed from gallery');
        setSelectedEventForGallery({
          ...selectedEventForGallery,
          gallery: updatedGallery
        });
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error removing photo');
    }
  };

  // FREE-FLOW GALLERY HANDLERS (not event-wise)
  const handleGalleryPhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    let uploadedCount = 0;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'gallery');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-password': password },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          // Create gallery entry
          await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-password': password 
            },
            body: JSON.stringify({ 
              imageUrl: uploadData.path,
              caption: ''
            })
          });
          uploadedCount++;
        }
      }

      if (uploadedCount > 0) {
        toast.success(`${uploadedCount} photo(s) added to gallery!`);
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error uploading photos');
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleDeleteGalleryPhoto = async (photoId) => {
    if (!confirm('Delete this photo from gallery?')) return;
    
    try {
      const res = await fetch(`/api/admin/gallery/${photoId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Photo deleted');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error deleting photo');
    }
  };

  // NEWSLETTER DELETE HANDLER
  const handleDeleteSubscriber = async (subscriberId) => {
    if (!confirm('Delete this subscriber?')) return;
    
    try {
      const res = await fetch(`/api/admin/newsletter/${subscriberId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Subscriber deleted');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error deleting subscriber');
    }
  };

  // PARTNER HANDLERS
  const handleMarkPartnerReplied = async (partnerId, replied) => {
    try {
      const res = await fetch('/api/admin/partners/reply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id: partnerId, replied })
      });

      if (res.ok) {
        toast.success(replied ? 'Marked as replied' : 'Marked as unreplied');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error updating partner');
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (!confirm('Delete this partner inquiry?')) return;
    
    try {
      const res = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Partner inquiry deleted');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error deleting partner');
    }
  };

  // CONTACT HANDLERS
  const handleMarkContactRead = async (contactId, read) => {
    try {
      const res = await fetch('/api/admin/contacts/read', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify({ id: contactId, read })
      });

      if (res.ok) {
        toast.success(read ? 'Marked as read' : 'Marked as unread');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error updating contact');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Delete this contact message?')) return;
    
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Contact message deleted');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error deleting contact');
    }
  };

  // BRAND HANDLERS
  const handleBrandLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBrandUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'brands');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setBrandForm({ ...brandForm, logoUrl: data.path });
        toast.success('Logo uploaded!');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload error');
    } finally {
      setBrandUploading(false);
      if (brandLogoInputRef.current) brandLogoInputRef.current.value = '';
    }
  };

  const handleSaveBrand = async () => {
    if (!brandForm.name) {
      toast.error('Brand name is required');
      return;
    }

    try {
      const url = editingBrand 
        ? `/api/admin/brands/${editingBrand.id}`
        : '/api/admin/brands';
      
      const res = await fetch(url, {
        method: editingBrand ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': password 
        },
        body: JSON.stringify(brandForm)
      });

      if (res.ok) {
        toast.success(editingBrand ? 'Brand updated!' : 'Brand added!');
        setShowBrandForm(false);
        setEditingBrand(null);
        setBrandForm({ name: '', logoUrl: '', websiteUrl: '', order: 0 });
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error saving brand');
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!confirm('Delete this brand?')) return;
    
    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });

      if (res.ok) {
        toast.success('Brand deleted');
        fetchAllData(password);
      }
    } catch (err) {
      toast.error('Error deleting brand');
    }
  };

  const openEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name || '',
      logoUrl: brand.logoUrl || '',
      websiteUrl: brand.websiteUrl || '',
      order: brand.order || 0
    });
    setShowBrandForm(true);
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

  // Calculate stats with proper classification (removed orders and revenue)
  const upcomingEvents = events.filter(e => e.classification === 'upcoming');
  const pastEvents = events.filter(e => e.classification === 'past');
  const unrepliedPartners = partners.filter(p => !p.replied).length;
  const unreadContacts = contacts.filter(c => !c.read).length;
  
  const stats = {
    totalEvents: events.length,
    upcomingEvents: upcomingEvents.length,
    pastEvents: pastEvents.length,
    pendingTestimonials: testimonials.filter(t => !t.approved).length,
    totalTeamMembers: teamMembers.length,
    totalNewsletterSubscribers: newsletterSubscribers.length,
    totalPartners: partners.length,
    unrepliedPartners,
    totalContacts: contacts.length,
    unreadContacts,
    totalBrands: brands.length,
    totalGalleryPhotos: galleryPhotos.length
  };

  const categories = ['Bollywood Night', 'Concert', 'Holi', 'Garba', 'Navratri', 'Wedding', 'Corporate', 'Cultural', 'Other'];
  const cities = ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Leipzig', 'Stuttgart', 'Düsseldorf'];
  const brandOptions = ['IGK', 'BIG', 'Holi Bash Europe', 'Navaratri Fiesta Europe'];

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
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="testimonials">Reviews {stats.pendingTestimonials > 0 && <Badge className="ml-2 bg-red-500">{stats.pendingTestimonials}</Badge>}</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter <Badge className="ml-2" variant="secondary">{stats.totalNewsletterSubscribers}</Badge></TabsTrigger>
            <TabsTrigger value="partners">Partners {stats.unrepliedPartners > 0 && <Badge className="ml-2 bg-orange-500">{stats.unrepliedPartners}</Badge>}</TabsTrigger>
            <TabsTrigger value="contacts">Messages {stats.unreadContacts > 0 && <Badge className="ml-2 bg-blue-500">{stats.unreadContacts}</Badge>}</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
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
                        <SelectContent>{brandOptions.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
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

                  {/* CONTENT FIELDS SECTION */}
                  <div className="border rounded-lg p-4 bg-purple-50 space-y-4">
                    <Label className="flex items-center gap-2 text-purple-800 font-semibold">
                      <Edit2 className="h-4 w-4" />
                      Event Content (Where each field appears)
                    </Label>
                    
                    {/* Hero Tagline - Homepage hero only */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Hero Tagline <span className="text-purple-600">(Homepage hero only)</span></Label>
                        <span className={`text-xs ${eventForm.heroTagline.length > 140 ? 'text-red-500' : 'text-gray-500'}`}>
                          {eventForm.heroTagline.length}/140
                        </span>
                      </div>
                      <Input 
                        value={eventForm.heroTagline} 
                        onChange={(e) => setEventForm({ ...eventForm, heroTagline: e.target.value.slice(0, 140) })} 
                        placeholder="One catchy line for the homepage banner..."
                        maxLength={140}
                      />
                      <p className="text-xs text-gray-500">
                        💡 If empty, will show: "Don't miss this event in {'{city}'}."
                      </p>
                    </div>

                    {/* Short Summary - Event cards */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Short Summary <span className="text-purple-600">(Event cards)</span></Label>
                        <span className={`text-xs ${eventForm.shortSummary.length > 220 ? 'text-red-500' : 'text-gray-500'}`}>
                          {eventForm.shortSummary.length}/220
                        </span>
                      </div>
                      <Textarea 
                        value={eventForm.shortSummary} 
                        onChange={(e) => setEventForm({ ...eventForm, shortSummary: e.target.value.slice(0, 220) })} 
                        rows={2}
                        placeholder="Brief description for event cards on homepage and events page..."
                        maxLength={220}
                      />
                      <p className="text-xs text-gray-500">
                        💡 If empty, auto-generates from first 180 chars of description.
                      </p>
                    </div>

                    {/* Full Description - Event detail page only */}
                    <div className="space-y-2">
                      <Label className="text-sm">Full Description <span className="text-purple-600">(Event detail page only)</span></Label>
                      <Textarea 
                        value={eventForm.description} 
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} 
                        rows={5} 
                        placeholder="Full event description with all details, schedule info, what to expect..."
                      />
                      
                      {/* Auto-suggest button */}
                      {eventForm.description && !eventForm.heroTagline && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Extract first sentence for heroTagline
                            const firstSentence = eventForm.description.split(/[.!?]/)[0]?.trim();
                            if (firstSentence) {
                              setEventForm({ 
                                ...eventForm, 
                                heroTagline: firstSentence.slice(0, 140)
                              });
                            }
                          }}
                        >
                          Auto-fill Hero Tagline from first sentence
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Venue Address */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Venue Address</Label>
                      <Input 
                        value={eventForm.venueAddress} 
                        onChange={(e) => setEventForm({ ...eventForm, venueAddress: e.target.value })} 
                        placeholder="Street address..."
                      />
                    </div>
                    <div>
                      <Label>Google Maps URL</Label>
                      <Input 
                        value={eventForm.googleMapsUrl} 
                        onChange={(e) => setEventForm({ ...eventForm, googleMapsUrl: e.target.value })} 
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
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

          {/* Newsletter Subscribers */}
          <TabsContent value="newsletter">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                <p className="text-muted-foreground">{newsletterSubscribers.length} total subscribers</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  // Export to CSV
                  const csv = ['Email,Subscribed At'];
                  newsletterSubscribers.forEach(sub => {
                    csv.push(`${sub.email},${new Date(sub.subscribedAt).toLocaleDateString()}`);
                  });
                  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `igk-newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('CSV exported!');
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {newsletterSubscribers.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4 font-medium">#</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Subscribed At</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterSubscribers.map((subscriber, index) => (
                          <tr key={subscriber.id || index} className="border-t hover:bg-muted/50">
                            <td className="p-4 text-muted-foreground">{index + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{subscriber.email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString('en-DE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'N/A'}
                            </td>
                            <td className="p-4">
                              <Badge variant={subscriber.active !== false ? 'default' : 'secondary'}>
                                {subscriber.active !== false ? 'Active' : 'Unsubscribed'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteSubscriber(subscriber.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No newsletter subscribers yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Users can subscribe from the footer on the homepage.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Gallery - FREE-FLOW (not event-wise) */}
          <TabsContent value="gallery">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gallery</h2>
                <p className="text-muted-foreground">{galleryPhotos.length} photos</p>
              </div>
              <div>
                <Input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryPhotoUpload}
                  disabled={galleryUploading}
                  className="hidden"
                  id="gallery-upload-main"
                />
                <label htmlFor="gallery-upload-main">
                  <Button asChild disabled={galleryUploading}>
                    <span className="cursor-pointer">
                      {galleryUploading ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <ImagePlus className="mr-2 h-4 w-4" />
                          Upload Photos
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={photo.imageUrl} 
                        alt={photo.caption || 'Gallery'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No photos in gallery yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload photos to showcase moments from your events.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Partner Inquiries</h2>
                <p className="text-muted-foreground">{partners.length} total, {stats.unrepliedPartners} unreplied</p>
              </div>
            </div>

            {partners.length > 0 ? (
              <div className="space-y-4">
                {partners.map((partner) => (
                  <Card key={partner.id} className={partner.replied ? 'opacity-60' : ''}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{partner.name}</h3>
                            {partner.replied ? (
                              <Badge variant="secondary">Replied</Badge>
                            ) : (
                              <Badge variant="default" className="bg-orange-500">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {partner.email} {partner.phone && `• ${partner.phone}`}
                          </p>
                          {partner.company && (
                            <p className="text-sm mb-2">Company: <strong>{partner.company}</strong></p>
                          )}
                          {partner.partnershipType && (
                            <p className="text-sm mb-2">Type: <Badge variant="outline">{partner.partnershipType}</Badge></p>
                          )}
                          <p className="mt-3 text-gray-700">{partner.message}</p>
                          <p className="text-xs text-muted-foreground mt-3">
                            Received: {new Date(partner.createdAt).toLocaleDateString('en-DE', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={partner.replied ? 'outline' : 'default'}
                            onClick={() => handleMarkPartnerReplied(partner.id, !partner.replied)}
                          >
                            {partner.replied ? 'Mark Unreplied' : 'Mark Replied'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500"
                            onClick={() => handleDeletePartner(partner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No partner inquiries yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Contact Messages</h2>
                <p className="text-muted-foreground">{contacts.length} total, {stats.unreadContacts} unread</p>
              </div>
            </div>

            {contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className={contact.read ? 'opacity-60' : ''}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{contact.name}</h3>
                            {contact.read ? (
                              <Badge variant="secondary">Read</Badge>
                            ) : (
                              <Badge variant="default" className="bg-blue-500">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {contact.email} {contact.phone && `• ${contact.phone}`}
                          </p>
                          {contact.subject && (
                            <p className="text-sm mb-2">Subject: <strong>{contact.subject}</strong></p>
                          )}
                          <p className="mt-3 text-gray-700">{contact.message}</p>
                          <p className="text-xs text-muted-foreground mt-3">
                            Received: {new Date(contact.createdAt).toLocaleDateString('en-DE', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={contact.read ? 'outline' : 'default'}
                            onClick={() => handleMarkContactRead(contact.id, !contact.read)}
                          >
                            {contact.read ? 'Mark Unread' : 'Mark Read'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No contact messages yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Brands Tab (Collaborating Partners) */}
          <TabsContent value="brands">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Collaborating Brands</h2>
                <p className="text-muted-foreground">Manage brands shown on the "Trusted By" page</p>
              </div>
              <Button onClick={() => { setEditingBrand(null); setBrandForm({ name: '', logoUrl: '', websiteUrl: '', order: 0 }); setShowBrandForm(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </div>

            {/* Brand Form Dialog */}
            <Dialog open={showBrandForm} onOpenChange={setShowBrandForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Brand Name *</Label>
                    <Input 
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      placeholder="e.g., Horbach, DVAG"
                    />
                  </div>
                  <div>
                    <Label>Website URL</Label>
                    <Input 
                      value={brandForm.websiteUrl}
                      onChange={(e) => setBrandForm({ ...brandForm, websiteUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                      {brandForm.logoUrl && (
                        <img src={brandForm.logoUrl} alt="Logo preview" className="h-12 w-auto object-contain border rounded" />
                      )}
                      <Input
                        ref={brandLogoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBrandLogoUpload}
                        disabled={brandUploading}
                        className="hidden"
                        id="brand-logo-upload"
                      />
                      <label htmlFor="brand-logo-upload">
                        <Button asChild variant="outline" disabled={brandUploading}>
                          <span className="cursor-pointer">
                            {brandUploading ? 'Uploading...' : 'Upload Logo'}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input 
                      type="number"
                      value={brandForm.order}
                      onChange={(e) => setBrandForm({ ...brandForm, order: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBrandForm(false)}>Cancel</Button>
                  <Button onClick={handleSaveBrand}>
                    {editingBrand ? 'Update' : 'Add'} Brand
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {brands.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {brands.map((brand) => (
                  <Card key={brand.id}>
                    <CardContent className="p-4 text-center">
                      {brand.logoUrl ? (
                        <div className="h-16 flex items-center justify-center mb-3">
                          <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-16 flex items-center justify-center mb-3 bg-gray-100 rounded">
                          <span className="text-2xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                        </div>
                      )}
                      <p className="font-semibold">{brand.name}</p>
                      <div className="flex justify-center gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => openEditBrand(brand)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteBrand(brand.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No brands added yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add brand logos to showcase on the "Trusted By" page.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
