import { NextResponse } from 'next/server';
import { Event } from '@/lib/models/Event';
import { Order } from '@/lib/models/Order';
import { Ticket } from '@/lib/models/Ticket';
import { sampleEvents } from '@/lib/seed-events';
import axios from 'axios';
import * as cheerio from 'cheerio';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// GET handler
export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    // Health check
    if (path === 'health') {
      return corsResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // Seed events (for initial setup)
    if (path === 'seed-events') {
      try {
        for (const eventData of sampleEvents) {
          const existing = await Event.findBySlug(eventData.slug);
          if (!existing) {
            await Event.create(eventData);
          }
        }
        return corsResponse({ message: 'Events seeded successfully', count: sampleEvents.length });
      } catch (error) {
        console.error('Seed error:', error);
        return corsResponse({ error: 'Failed to seed events', details: error.message }, 500);
      }
    }

    // Get all events with filters
    if (path === 'events') {
      const category = searchParams.get('category');
      const city = searchParams.get('city');
      const status = searchParams.get('status') || 'published';
      const type = searchParams.get('type'); // upcoming, past, all

      let events;
      
      if (type === 'upcoming') {
        events = await Event.getUpcoming(100);
      } else if (type === 'past') {
        events = await Event.getPast(100);
      } else {
        const filters = { status };
        if (category) filters.category = category;
        if (city) filters.city = city;
        events = await Event.findAll(filters);
      }

      return corsResponse({ events });
    }

    // Get single event by slug
    if (path.startsWith('events/')) {
      const slug = path.replace('events/', '');
      const event = await Event.findBySlug(slug);
      
      if (!event) {
        return corsResponse({ error: 'Event not found' }, 404);
      }

      return corsResponse({ event });
    }

    // Get order by orderId and email
    if (path === 'orders/lookup') {
      const orderId = searchParams.get('orderId');
      const email = searchParams.get('email');

      if (!orderId || !email) {
        return corsResponse({ error: 'OrderId and email are required' }, 400);
      }

      const order = await Order.findByOrderId(orderId);
      
      if (!order || order.email !== email) {
        return corsResponse({ error: 'Order not found' }, 404);
      }

      const tickets = await Ticket.findByOrderId(order.id);
      
      return corsResponse({ order, tickets });
    }

    // Admin: Get all orders
    if (path === 'admin/orders') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const orders = await Order.getAll();
      return corsResponse({ orders });
    }

    // Admin: Get event stats
    if (path.startsWith('admin/events/') && path.endsWith('/stats')) {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const eventId = path.replace('admin/events/', '').replace('/stats', '');
      const orders = await Order.findByEventId(eventId);
      const ticketStats = await Ticket.getStats(eventId);
      
      const revenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return corsResponse({
        stats: {
          totalOrders: orders.length,
          completedOrders: orders.filter(o => o.status === 'completed').length,
          revenue,
          tickets: ticketStats
        }
      });
    }

    // Admin: Check-in ticket
    if (path === 'admin/check-in') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const ticketCode = searchParams.get('ticketCode');
      
      if (!ticketCode) {
        return corsResponse({ error: 'Ticket code required' }, 400);
      }

      const ticket = await Ticket.findByTicketCode(ticketCode);
      
      if (!ticket) {
        return corsResponse({ error: 'Ticket not found' }, 404);
      }

      if (ticket.isUsed) {
        return corsResponse({ 
          error: 'Ticket already used',
          usedAt: ticket.usedAt 
        }, 400);
      }

      return corsResponse({ ticket, valid: true });
    }

    // Scrape Linktree for community links
    if (path === 'community/links') {
      try {
        const response = await axios.get('https://linktr.ee/indianexpatsingermany', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const $ = cheerio.load(response.data);
        const links = [];

        // Find all link elements (Linktree structure may vary)
        $('a[href]').each((i, elem) => {
          const href = $(elem).attr('href');
          const text = $(elem).text().trim();
          
          if (href && text && !href.includes('linktree') && !href.includes('linktr.ee')) {
            // Categorize links
            let category = 'other';
            const lowerHref = href.toLowerCase();
            const lowerText = text.toLowerCase();
            
            if (lowerHref.includes('whatsapp') || lowerText.includes('whatsapp')) {
              category = 'whatsapp';
            } else if (lowerHref.includes('facebook') || lowerText.includes('facebook')) {
              category = 'facebook';
            } else if (lowerHref.includes('telegram') || lowerText.includes('telegram')) {
              category = 'telegram';
            } else if (lowerHref.includes('instagram') || lowerText.includes('instagram')) {
              category = 'instagram';
            }

            links.push({
              title: text,
              url: href,
              category
            });
          }
        });

        // Fallback sample data if scraping fails
        if (links.length === 0) {
          return corsResponse({
            links: [
              { title: 'Berlin Indian Community', url: 'https://chat.whatsapp.com/sample1', category: 'whatsapp' },
              { title: 'Munich Desi Group', url: 'https://chat.whatsapp.com/sample2', category: 'whatsapp' },
              { title: 'Frankfurt Indian Expats', url: 'https://facebook.com/groups/sample', category: 'facebook' },
              { title: 'Germans Indians Network', url: 'https://t.me/sample', category: 'telegram' },
              { title: 'IGK Events Instagram', url: 'https://instagram.com/igkevents', category: 'instagram' }
            ],
            note: 'Sample data - Live scraping unavailable'
          });
        }

        return corsResponse({ links });
      } catch (error) {
        console.error('Scraping error:', error);
        // Return fallback data
        return corsResponse({
          links: [
            { title: 'Berlin Indian Community', url: 'https://chat.whatsapp.com/sample1', category: 'whatsapp' },
            { title: 'Munich Desi Group', url: 'https://chat.whatsapp.com/sample2', category: 'whatsapp' },
            { title: 'Frankfurt Indian Expats', url: 'https://facebook.com/groups/sample', category: 'facebook' },
            { title: 'German Indians Network', url: 'https://t.me/sample', category: 'telegram' },
            { title: 'IGK Events Instagram', url: 'https://instagram.com/igkevents', category: 'instagram' }
          ],
          note: 'Sample data - Live scraping unavailable'
        });
      }
    }

    return corsResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return corsResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}

// POST handler
export async function POST(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const body = await request.json();

    // Create event
    if (path === 'admin/events') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const event = await Event.create(body);
      return corsResponse({ event, message: 'Event created successfully' }, 201);
    }

    // Create order (ticket purchase)
    if (path === 'orders') {
      const { eventId, email, name, ticketType, quantity, totalAmount } = body;

      if (!eventId || !email || !name || !ticketType || !quantity) {
        return corsResponse({ error: 'Missing required fields' }, 400);
      }

      // Create order
      const order = await Order.create({
        eventId,
        email,
        name,
        ticketType,
        quantity,
        totalAmount,
        status: 'pending'
      });

      // Create tickets
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await Ticket.create({
          orderId: order.id,
          eventId,
          ticketType,
          attendeeName: name
        });
        tickets.push(ticket);
      }

      return corsResponse({ 
        order, 
        tickets,
        message: 'Order created successfully. Proceed to payment.' 
      }, 201);
    }

    // Confirm order (after Stripe payment)
    if (path === 'orders/confirm') {
      const { orderId, paymentIntentId } = body;

      if (!orderId) {
        return corsResponse({ error: 'Order ID required' }, 400);
      }

      const order = await Order.findById(orderId);
      
      if (!order) {
        return corsResponse({ error: 'Order not found' }, 404);
      }

      await Order.updateStatus(orderId, 'completed');
      
      const tickets = await Ticket.findByOrderId(orderId);

      // TODO: Send email with tickets
      
      return corsResponse({ 
        order, 
        tickets,
        message: 'Order confirmed! Check your email for tickets.' 
      });
    }

    // Admin: Check-in ticket (mark as used)
    if (path === 'admin/check-in/confirm') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const { ticketCode } = body;
      
      if (!ticketCode) {
        return corsResponse({ error: 'Ticket code required' }, 400);
      }

      const success = await Ticket.markAsUsed(ticketCode);
      
      if (!success) {
        return corsResponse({ error: 'Failed to check-in ticket' }, 400);
      }

      const ticket = await Ticket.findByTicketCode(ticketCode);

      return corsResponse({ 
        ticket,
        message: 'Ticket checked-in successfully!' 
      });
    }

    // Newsletter subscription
    if (path === 'newsletter') {
      const { email } = body;
      
      if (!email) {
        return corsResponse({ error: 'Email required' }, 400);
      }

      // TODO: Save to newsletter collection
      
      return corsResponse({ message: 'Subscribed successfully!' });
    }

    return corsResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return corsResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}

// PUT handler
export async function PUT(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const password = request.headers.get('x-admin-password');
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    const body = await request.json();

    // Update event
    if (path.startsWith('admin/events/')) {
      const eventId = path.replace('admin/events/', '');
      const success = await Event.update(eventId, body);
      
      if (!success) {
        return corsResponse({ error: 'Event not found' }, 404);
      }

      const event = await Event.findById(eventId);
      return corsResponse({ event, message: 'Event updated successfully' });
    }

    return corsResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return corsResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}

// DELETE handler
export async function DELETE(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/', '');

  try {
    const password = request.headers.get('x-admin-password');
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return corsResponse({ error: 'Unauthorized' }, 401);
    }

    // Delete event
    if (path.startsWith('admin/events/')) {
      const eventId = path.replace('admin/events/', '');
      const success = await Event.delete(eventId);
      
      if (!success) {
        return corsResponse({ error: 'Event not found' }, 404);
      }

      return corsResponse({ message: 'Event deleted successfully' });
    }

    return corsResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return corsResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}
