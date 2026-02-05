import { NextResponse } from 'next/server';
import { Event } from '@/lib/models/Event';
import { Order } from '@/lib/models/Order';
import { Ticket } from '@/lib/models/Ticket';
import { Testimonial } from '@/lib/models/Testimonial';
import { SiteSettings } from '@/lib/models/SiteSettings';
import { TeamMember } from '@/lib/models/TeamMember';
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

    // Get site statistics (fixed values + dynamic rating)
    if (path === 'stats') {
      try {
        // Get average rating from testimonials (this is computed dynamically)
        const ratingData = await Testimonial.getAverageRating();
        
        // Return fixed stats from siteConfig + dynamic rating
        return corsResponse({
          stats: {
            totalEvents: 50,       // Fixed: "50+"
            totalCities: 8,        // Fixed: "8"
            totalAttendees: 25000, // Fixed: "25K+"
            averageRating: ratingData.averageRating,
            totalRatings: ratingData.totalRatings
          }
        });
      } catch (error) {
        console.error('Stats error:', error);
        return corsResponse({
          stats: {
            totalEvents: 50,
            totalCities: 8,
            totalAttendees: 25000,
            averageRating: 5.0,
            totalRatings: 0
          }
        });
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

    // Get testimonials
    if (path === 'testimonials') {
      const limit = parseInt(searchParams.get('limit')) || 10;
      const testimonials = await Testimonial.getRecentApproved(limit);
      const ratingData = await Testimonial.getAverageRating();
      
      return corsResponse({ 
        testimonials,
        averageRating: ratingData.averageRating,
        totalRatings: ratingData.totalRatings
      });
    }

    // Admin: Get pending testimonials
    if (path === 'admin/testimonials') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const testimonials = await Testimonial.findAll({ approvedOnly: false });
      return corsResponse({ testimonials });
    }

    // Admin: Get settings
    if (path === 'admin/settings') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      await SiteSettings.initializeDefaults();
      const settings = await SiteSettings.getAll();
      return corsResponse({ settings });
    }

    // Get team members (public)
    if (path === 'team') {
      const type = searchParams.get('type'); // 'leadership' or 'city'
      const city = searchParams.get('city');
      
      if (type === 'leadership') {
        const members = await TeamMember.getLeadershipTeam();
        return corsResponse({ members });
      } else if (type === 'city' && city) {
        const members = await TeamMember.getCityTeam(city);
        return corsResponse({ members });
      } else if (type === 'city') {
        const cityTeams = await TeamMember.getAllCityTeams();
        return corsResponse({ cityTeams });
      } else {
        const leadership = await TeamMember.getLeadershipTeam();
        const cityTeams = await TeamMember.getAllCityTeams();
        return corsResponse({ leadership, cityTeams });
      }
    }

    // Seed team members
    if (path === 'seed-team') {
      const result = await TeamMember.seedDefaultTeam();
      return corsResponse(result);
    }

    // Admin: Get all team members
    if (path === 'admin/team') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const members = await TeamMember.findAll();
      return corsResponse({ members });
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
        const response = await axios.get('https://linktr.ee/igkonnekt', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const $ = cheerio.load(response.data);
        const links = [];

        // Try to extract from script tag (Linktree stores data in JSON)
        const scriptContent = $('script#__NEXT_DATA__').html();
        if (scriptContent) {
          try {
            const data = JSON.parse(scriptContent);
            const linksData = data?.props?.pageProps?.links || [];
            
            linksData.forEach(link => {
              if (link.url && link.title) {
                let category = 'other';
                const lowerUrl = link.url.toLowerCase();
                const lowerTitle = link.title.toLowerCase();
                
                if (lowerUrl.includes('whatsapp') || lowerTitle.includes('whatsapp')) {
                  category = 'whatsapp';
                } else if (lowerUrl.includes('facebook') || lowerTitle.includes('facebook')) {
                  category = 'facebook';
                } else if (lowerUrl.includes('telegram') || lowerTitle.includes('telegram')) {
                  category = 'telegram';
                } else if (lowerUrl.includes('instagram') || lowerTitle.includes('instagram')) {
                  category = 'instagram';
                } else if (lowerUrl.includes('linkedin') || lowerTitle.includes('linkedin')) {
                  category = 'linkedin';
                }

                links.push({
                  title: link.title,
                  url: link.url,
                  category
                });
              }
            });
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }

        // Fallback: scrape from HTML
        if (links.length === 0) {
          $('a[href]').each((i, elem) => {
            const href = $(elem).attr('href');
            const text = $(elem).text().trim();
            
            if (href && text && !href.includes('linktree') && !href.includes('linktr.ee')) {
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
        }

        // Return scraped links or fallback
        if (links.length > 0) {
          return corsResponse({ links, source: 'linktree' });
        }

        // Fallback sample data if scraping fails
        return corsResponse({
          links: [
            { title: 'IGK WhatsApp Community', url: 'https://chat.whatsapp.com/sample1', category: 'whatsapp' },
            { title: 'Berlin Indian Community', url: 'https://chat.whatsapp.com/sample2', category: 'whatsapp' },
            { title: 'IGK Instagram', url: 'https://instagram.com/igkonnekt', category: 'instagram' },
            { title: 'IGK Facebook', url: 'https://facebook.com/igkonnekt', category: 'facebook' },
            { title: 'IGK LinkedIn', url: 'https://linkedin.com/company/igkonnekt', category: 'linkedin' }
          ],
          note: 'Sample data - Visit linktr.ee/igkonnekt for live links',
          source: 'fallback'
        });
      } catch (error) {
        console.error('Scraping error:', error);
        return corsResponse({
          links: [
            { title: 'IGK WhatsApp Community', url: 'https://chat.whatsapp.com/sample1', category: 'whatsapp' },
            { title: 'Berlin Indian Community', url: 'https://chat.whatsapp.com/sample2', category: 'whatsapp' },
            { title: 'IGK Instagram', url: 'https://instagram.com/igkonnekt', category: 'instagram' },
            { title: 'IGK Facebook', url: 'https://facebook.com/igkonnekt', category: 'facebook' }
          ],
          note: 'Sample data - Visit linktr.ee/igkonnekt for live links',
          source: 'fallback'
        });
      }
    }

    // Scrape DesiPass events
    if (path === 'desipass/events') {
      try {
        const eventUrls = [
          'https://www.desipass.com/events/events-details?eventId=01KFGQC5TH7MJ7R58V1Q5PSTAK',
          'https://www.desipass.com/events/events-details?eventId=01KGAHGE2M0213NYZBFPZ8WT5Y'
        ];

        const events = [];

        for (const url of eventUrls) {
          try {
            const response = await axios.get(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              timeout: 5000
            });

            const $ = cheerio.load(response.data);
            
            // Try to extract event details (structure may vary)
            const title = $('h1').first().text().trim() || 
                          $('[class*="title"]').first().text().trim() ||
                          'Event from DesiPass';
            
            const dateText = $('[class*="date"]').first().text().trim() ||
                            $('time').first().text().trim() || '';
            
            const location = $('[class*="location"]').first().text().trim() ||
                            $('[class*="venue"]').first().text().trim() || 'Germany';

            const image = $('meta[property="og:image"]').attr('content') ||
                         $('img[class*="event"]').first().attr('src') || '';

            events.push({
              title,
              date: dateText,
              location,
              image,
              ticketUrl: url,
              platform: 'DesiPass',
              source: 'scraped'
            });
          } catch (err) {
            console.error(`Error scraping ${url}:`, err.message);
          }
        }

        // Fallback with placeholder data if scraping fails
        if (events.length === 0) {
          events.push(
            {
              title: 'Upcoming Event on DesiPass',
              date: 'Check DesiPass for dates',
              location: 'Germany',
              image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=800',
              ticketUrl: 'https://www.desipass.com/events/events-details?eventId=01KFGQC5TH7MJ7R58V1Q5PSTAK',
              platform: 'DesiPass',
              source: 'placeholder'
            },
            {
              title: 'Another Event on DesiPass',
              date: 'Check DesiPass for dates',
              location: 'Germany',
              image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
              ticketUrl: 'https://www.desipass.com/events/events-details?eventId=01KGAHGE2M0213NYZBFPZ8WT5Y',
              platform: 'DesiPass',
              source: 'placeholder'
            }
          );
        }

        return corsResponse({ events });
      } catch (error) {
        console.error('DesiPass scraping error:', error);
        return corsResponse({ 
          events: [],
          error: 'Failed to fetch DesiPass events'
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

    // Submit testimonial
    if (path === 'testimonials') {
      const { name, email, eventAttended, rating, testimonial, city, website } = body;

      if (!name || !email || !eventAttended || !testimonial) {
        return corsResponse({ error: 'Missing required fields' }, 400);
      }

      // Validate rating (1-5 stars)
      const ratingNum = parseInt(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return corsResponse({ 
          error: 'Invalid rating',
          message: 'Please select a rating between 1 and 5 stars.'
        }, 400);
      }

      try {
        const newTestimonial = await Testimonial.create({
          name,
          email,
          eventAttended,
          rating: ratingNum,
          testimonial,
          city,
          website // Honeypot field for spam detection
        });

        return corsResponse({ 
          testimonial: newTestimonial,
          message: 'Thank you for your review! It will be displayed after moderation.'
        }, 201);
      } catch (err) {
        // Handle rate limiting and spam errors gracefully
        if (err.message.includes('one review per hour')) {
          return corsResponse({ error: err.message }, 429);
        }
        if (err.message.includes('Spam')) {
          return corsResponse({ error: 'Submission failed' }, 400);
        }
        return corsResponse({ error: err.message }, 400);
      }
    }

    // Admin: Approve testimonial
    if (path === 'admin/testimonials/approve') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const { id } = body;
      const success = await Testimonial.approve(id);
      
      if (!success) {
        return corsResponse({ error: 'Testimonial not found' }, 404);
      }

      return corsResponse({ message: 'Testimonial approved' });
    }

    // Admin: Reject testimonial
    if (path === 'admin/testimonials/reject') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const { id } = body;
      const success = await Testimonial.reject(id);
      
      if (!success) {
        return corsResponse({ error: 'Testimonial not found' }, 404);
      }

      return corsResponse({ message: 'Testimonial rejected and deleted' });
    }

    // Admin: Update settings
    if (path === 'admin/settings') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      for (const [key, value] of Object.entries(body)) {
        await SiteSettings.set(key, value);
      }

      return corsResponse({ message: 'Settings updated' });
    }

    // Create event
    if (path === 'admin/events') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const event = await Event.create(body);
      return corsResponse({ event, message: 'Event created successfully' }, 201);
    }

    // Create team member
    if (path === 'admin/team') {
      const password = request.headers.get('x-admin-password');
      
      if (password !== process.env.ADMIN_PASSWORD) {
        return corsResponse({ error: 'Unauthorized' }, 401);
      }

      const member = await TeamMember.create(body);
      return corsResponse({ member, message: 'Team member added successfully' }, 201);
    }

    // Create order (ticket purchase)
    if (path === 'orders') {
      const { eventId, email, name, ticketType, quantity, totalAmount } = body;

      if (!eventId || !email || !name || !ticketType || !quantity) {
        return corsResponse({ error: 'Missing required fields' }, 400);
      }

      const order = await Order.create({
        eventId,
        email,
        name,
        ticketType,
        quantity,
        totalAmount,
        status: 'pending'
      });

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

    // Confirm order (after payment)
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
      
      if (!email || !email.includes('@')) {
        return corsResponse({ error: 'Valid email required' }, 400);
      }

      try {
        const { Newsletter } = await import('@/lib/models/Newsletter');
        const result = await Newsletter.subscribe(email);
        
        if (result.success) {
          return corsResponse({ message: 'Successfully subscribed to newsletter!' });
        } else {
          return corsResponse({ error: result.message || 'Already subscribed' }, 400);
        }
      } catch (error) {
        console.error('Newsletter error:', error);
        return corsResponse({ error: 'Failed to subscribe' }, 500);
      }
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

    // Update team member
    if (path.startsWith('admin/team/')) {
      const memberId = path.replace('admin/team/', '');
      const success = await TeamMember.update(memberId, body);
      
      if (!success) {
        return corsResponse({ error: 'Team member not found' }, 404);
      }

      const member = await TeamMember.findById(memberId);
      return corsResponse({ member, message: 'Team member updated successfully' });
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

    // Delete team member
    if (path.startsWith('admin/team/')) {
      const memberId = path.replace('admin/team/', '');
      const success = await TeamMember.delete(memberId);
      
      if (!success) {
        return corsResponse({ error: 'Team member not found' }, 404);
      }

      return corsResponse({ message: 'Team member deleted successfully' });
    }

    return corsResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return corsResponse({ error: 'Internal server error', details: error.message }, 500);
  }
}
