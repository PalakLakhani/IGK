import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Europe/Berlin';

export class Event {
  static collectionName = 'events';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  /**
   * Get current time in Berlin timezone
   */
  static getBerlinNow() {
    return toZonedTime(new Date(), TIMEZONE);
  }

  /**
   * Parse a date string to Berlin timezone Date object
   */
  static parseToBerlinTime(dateString) {
    if (!dateString) return null;
    // If it's already a Date object
    if (dateString instanceof Date) {
      return dateString;
    }
    // Parse the date string in Berlin timezone
    const date = new Date(dateString);
    return date;
  }

  /**
   * Determine if an event is upcoming, past, or ongoing based on Berlin timezone
   * Uses intelligent classification:
   * - Upcoming: startDateTime >= now (Berlin)
   * - Past: endDateTime < now (Berlin), or if no endDateTime: startDateTime + 6 hours < now
   */
  static classifyEvent(event) {
    const now = new Date();
    const startDate = event.startDateTime ? new Date(event.startDateTime) : new Date(event.date);
    
    // If there's a status override, use it (except 'auto')
    if (event.statusOverride && event.statusOverride !== 'auto') {
      return event.statusOverride;
    }

    // If event is draft, it's neither upcoming nor past
    if (event.status === 'draft' || !event.status || event.status !== 'published') {
      return 'draft';
    }

    // Calculate end time
    let endDate;
    if (event.endDateTime) {
      endDate = new Date(event.endDateTime);
    } else {
      // Fallback: event ends 6 hours after start, or end of day
      endDate = new Date(startDate.getTime() + (6 * 60 * 60 * 1000));
    }

    // Classification logic
    if (startDate > now) {
      return 'upcoming';
    } else if (endDate < now) {
      return 'past';
    } else {
      // Event is currently ongoing
      return 'upcoming'; // Show ongoing events as upcoming
    }
  }

  static async create(eventData) {
    const collection = await this.getCollection();
    
    // Build startDateTime from date and time if not provided
    let startDateTime = eventData.startDateTime;
    if (!startDateTime && eventData.date) {
      const dateStr = eventData.date;
      const timeStr = eventData.time || '19:00';
      startDateTime = new Date(`${dateStr}T${timeStr}:00`);
    }

    const event = {
      id: uuidv4(),
      title: eventData.title,
      slug: eventData.slug || this.generateSlug(eventData.title),
      description: eventData.description || '',
      longDescription: eventData.longDescription || '',
      
      // Location
      city: eventData.city,
      venue: eventData.venue || '',
      venueAddress: eventData.venueAddress || '',
      googleMapsUrl: eventData.googleMapsUrl || '',
      
      // Date/Time - Store as ISO strings for consistency
      startDateTime: startDateTime ? new Date(startDateTime).toISOString() : null,
      endDateTime: eventData.endDateTime ? new Date(eventData.endDateTime).toISOString() : null,
      // Keep legacy date field for backward compatibility
      date: startDateTime ? new Date(startDateTime).toISOString() : eventData.date,
      time: eventData.time || '19:00',
      endTime: eventData.endTime || '',
      
      // Media
      poster: eventData.poster || eventData.coverImageUrl || '',
      coverImagePath: eventData.coverImagePath || '',
      coverImageUrl: eventData.coverImageUrl || eventData.poster || '',
      gallery: eventData.gallery || [],
      
      // Categorization
      category: eventData.category || 'Other',
      brand: eventData.brand || 'IGK', // BIG, Holi Bash Europe, Navaratri Fiesta Europe
      tags: eventData.tags || [],
      
      // Ticketing - Unified external links
      ticketPlatforms: {
        desipassUrl: eventData.desipassUrl || eventData.ticketPlatforms?.desipassUrl || '',
        eventbriteUrl: eventData.eventbriteUrl || eventData.ticketPlatforms?.eventbriteUrl || ''
      },
      // Legacy fields for backward compatibility
      desipassUrl: eventData.desipassUrl || eventData.ticketPlatforms?.desipassUrl || '',
      eventbriteUrl: eventData.eventbriteUrl || eventData.ticketPlatforms?.eventbriteUrl || '',
      ticketTypes: eventData.ticketTypes || [],
      externalLinks: eventData.externalLinks || {},
      
      // Capacity & Stats
      capacity: eventData.capacity || 0,
      attendeesCount: eventData.attendeesCount || 0,
      
      // Event details
      rules: eventData.rules || [],
      faqs: eventData.faqs || [],
      schedule: eventData.schedule || [],
      
      // Status
      status: eventData.status || 'published',
      statusOverride: eventData.statusOverride || 'auto', // 'auto', 'upcoming', 'past', 'draft'
      featured: eventData.featured || false,
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(event);
    return event;
  }

  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  static async findBySlug(slug) {
    const collection = await this.getCollection();
    return await collection.findOne({ slug });
  }

  static async findAll(filters = {}) {
    const collection = await this.getCollection();
    const query = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.city) {
      query.city = filters.city;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    const events = await collection.find(query).sort({ startDateTime: 1, date: 1 }).toArray();
    
    // Add classification to each event
    return events.map(event => ({
      ...event,
      classification: this.classifyEvent(event)
    }));
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    
    // Handle startDateTime conversion
    if (updates.date && updates.time && !updates.startDateTime) {
      updates.startDateTime = new Date(`${updates.date}T${updates.time}:00`).toISOString();
    }
    
    // Update ticketPlatforms if individual URLs provided
    if (updates.desipassUrl !== undefined || updates.eventbriteUrl !== undefined) {
      const existing = await this.findById(id);
      updates.ticketPlatforms = {
        desipassUrl: updates.desipassUrl ?? existing?.ticketPlatforms?.desipassUrl ?? '',
        eventbriteUrl: updates.eventbriteUrl ?? existing?.ticketPlatforms?.eventbriteUrl ?? ''
      };
    }
    
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  /**
   * Get upcoming events using Berlin timezone
   */
  static async getUpcoming(limit = 10) {
    const collection = await this.getCollection();
    const now = new Date();
    
    // Find events where startDateTime is in the future
    const events = await collection
      .find({ 
        status: 'published',
        $or: [
          { startDateTime: { $gte: now.toISOString() } },
          { date: { $gte: now } }
        ]
      })
      .sort({ startDateTime: 1, date: 1 })
      .limit(limit * 2) // Fetch more to filter properly
      .toArray();
    
    // Filter using intelligent classification
    const upcomingEvents = events
      .filter(event => this.classifyEvent(event) === 'upcoming')
      .slice(0, limit);
    
    return upcomingEvents.map(event => ({
      ...event,
      classification: 'upcoming'
    }));
  }

  /**
   * Get past events using Berlin timezone
   */
  static async getPast(limit = 10) {
    const collection = await this.getCollection();
    const now = new Date();
    
    // Find events where date is in the past
    const events = await collection
      .find({ 
        status: 'published',
        $or: [
          { startDateTime: { $lt: now.toISOString() } },
          { date: { $lt: now } }
        ]
      })
      .sort({ startDateTime: -1, date: -1 })
      .limit(limit * 2) // Fetch more to filter properly
      .toArray();
    
    // Filter using intelligent classification
    const pastEvents = events
      .filter(event => this.classifyEvent(event) === 'past')
      .slice(0, limit);
    
    return pastEvents.map(event => ({
      ...event,
      classification: 'past'
    }));
  }

  /**
   * Get all events with proper classification
   */
  static async getAllClassified() {
    const collection = await this.getCollection();
    
    const events = await collection
      .find({ status: 'published' })
      .sort({ startDateTime: 1, date: 1 })
      .toArray();
    
    const upcoming = [];
    const past = [];
    
    events.forEach(event => {
      const classification = this.classifyEvent(event);
      const classifiedEvent = { ...event, classification };
      
      if (classification === 'upcoming') {
        upcoming.push(classifiedEvent);
      } else if (classification === 'past') {
        past.push(classifiedEvent);
      }
    });
    
    // Sort: upcoming by date ascending, past by date descending
    upcoming.sort((a, b) => new Date(a.startDateTime || a.date) - new Date(b.startDateTime || b.date));
    past.sort((a, b) => new Date(b.startDateTime || b.date) - new Date(a.startDateTime || a.date));
    
    return { upcoming, past, all: [...upcoming, ...past] };
  }

  /**
   * Migrate existing events to new schema
   */
  static async migrateToNewSchema() {
    const collection = await this.getCollection();
    const events = await collection.find({}).toArray();
    
    for (const event of events) {
      const updates = {};
      
      // Ensure startDateTime exists
      if (!event.startDateTime && event.date) {
        const dateObj = new Date(event.date);
        updates.startDateTime = dateObj.toISOString();
      }
      
      // Ensure ticketPlatforms structure
      if (!event.ticketPlatforms) {
        updates.ticketPlatforms = {
          desipassUrl: event.desipassUrl || event.externalLinks?.desipass || '',
          eventbriteUrl: event.eventbriteUrl || event.externalLinks?.eventbrite || ''
        };
      }
      
      // Ensure poster/coverImageUrl
      if (!event.coverImageUrl && event.poster) {
        updates.coverImageUrl = event.poster;
      }
      
      // Set default statusOverride
      if (!event.statusOverride) {
        updates.statusOverride = 'auto';
      }
      
      if (Object.keys(updates).length > 0) {
        await collection.updateOne({ id: event.id }, { $set: updates });
      }
    }
    
    return { migrated: events.length };
  }
}
