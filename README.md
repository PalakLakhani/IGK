# IGK Events - Event Management Website

Premium Indian cultural events platform for Germany. Complete event website with ticketing, community features, and admin dashboard.

## 🎉 Features

### Public Features
- **Homepage**: Hero slider with upcoming events, testimonials, and community CTA
- **Event Listing**: Browse events with filters (city, category, date), search, and tabs (upcoming/all/past)
- **Event Details**: Full event information, schedule, FAQs, rules, and multi-platform ticketing
- **Gallery**: Past event photos and highlights
- **Community**: Linktree scraper pulling community groups (WhatsApp, Facebook, Telegram, Instagram)
- **My Tickets**: Order lookup with QR code display
- **Partner Page**: Partnership opportunities and contact form
- **Legal Pages**: Impressum, Datenschutz, Terms, Refund Policy (GDPR-ready placeholders)

### Ticketing System
- **3 Purchase Options**:
  1. Our Site: Stripe Checkout integration (structured, awaiting keys)
  2. DesiPass: External link
  3. Eventbrite: External link
- **QR Code Generation**: Automatic QR codes for all tickets
- **Email Delivery**: Placeholder email integration (ready for Resend/SendGrid)
- **Ticket Transfer**: Allow ticket reassignment
- **Ticket Validation**: Mark as used with timestamp

### Admin Dashboard
- **Authentication**: Simple password-based access (env variable)
- **Overview Stats**: Events, orders, revenue, check-ins
- **Event Management**: View all events, create/edit (structured)
- **Order Management**: View all orders with status and details
- **Check-In System**: Ticket validation (manual entry, QR scanner placeholder)
- **Analytics**: Basic revenue and ticket stats

### Technical Features
- **Database**: MongoDB with proper schemas (Events, Orders, Tickets)
- **API Routes**: RESTful API with all CRUD operations
- **Responsive Design**: Mobile-first, works on all devices
- **SEO Ready**: Proper meta tags, structured data placeholders
- **WhatsApp Integration**: Floating button, contact links
- **Linktree Scraper**: Automated community link extraction

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                    # Homepage
│   ├── layout.js                  # Root layout
│   ├── events/
│   │   ├── page.js               # Events listing
│   │   └── [slug]/page.js        # Event details
│   ├── community/page.js          # Community groups
│   ├── gallery/page.js            # Event gallery
│   ├── tickets/page.js            # Ticket lookup
│   ├── partner/page.js            # Partnership page
│   ├── admin/page.js              # Admin dashboard
│   ├── about/page.js              # About page
│   ├── contact/page.js            # Contact page
│   ├── impressum/page.js          # Legal: Impressum
│   ├── datenschutz/page.js        # Legal: Privacy
│   ├── terms/page.js              # Legal: Terms
│   ├── refund-policy/page.js      # Legal: Refund policy
│   └── api/
│       └── [[...path]]/route.js   # All API endpoints
├── components/
│   ├── Header.js                  # Site header
│   ├── Footer.js                  # Site footer
│   ├── EventCard.js               # Event card component
│   ├── WhatsAppFloat.js           # Floating WhatsApp button
│   └── ui/                        # shadcn components
├── lib/
│   ├── mongodb.js                 # Database connection
│   ├── models/
│   │   ├── Event.js              # Event model
│   │   ├── Order.js              # Order model
│   │   └── Ticket.js             # Ticket model
│   └── seed-events.js            # Sample event data
├── config/
│   └── site.js                   # Site configuration
├── .env                          # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Yarn package manager

### Installation

1. **Install dependencies**:
```bash
cd /app
yarn install
```

2. **Configure environment variables** (`.env`):
```bash
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=igk_events_db

# Site URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Stripe (Add when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_PASSWORD=your_secure_password

# Email (Add when ready)
EMAIL_FROM=noreply@igkevents.com
EMAIL_PROVIDER=mock

# Brand
NEXT_PUBLIC_BRAND_NAME=IGK Events
NEXT_PUBLIC_WHATSAPP_NUMBER=+491234567890
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/igkevents
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/igkevents
```

3. **Seed sample events**:
```bash
curl http://localhost:3000/api/seed-events
```

4. **Run development server**:
```bash
yarn dev
```

5. **Access the site**:
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin (password: admin123)

## 📝 Configuration

### Brand Settings (`/app/config/site.js`)
Edit this file to customize:
- Brand name, logo, description
- Contact information (email, phone, WhatsApp)
- Social media links
- Theme colors
- External ticketing platform links

### Sample Events
3 realistic events are pre-created:
1. Holi Festival Berlin 2025 (March 15)
2. Bollywood Night Munich (April 20)
3. Navratri Garba Frankfurt (October 10)

Each includes:
- Full event details, schedule, FAQs
- Multiple ticket types with pricing
- Rules and safety guidelines
- Venue information

## 🎫 Ticketing Flow

### When Stripe is Ready:
1. User selects event and ticket type
2. Creates order via `/api/orders` (POST)
3. Redirects to Stripe Checkout
4. After payment, confirms via `/api/orders/confirm` (POST)
5. System generates QR codes and sends email
6. User can view tickets at `/tickets`

### Current (Without Stripe):
- Users see structured ticket types
- External links to DesiPass and Eventbrite work
- Order/ticket system fully functional for testing

## 🔐 Admin Access

**URL**: `/admin`
**Default Password**: `admin123` (change in `.env`)

### Admin Features:
- View all events and orders
- Monitor revenue and statistics
- Check-in tickets (manual entry, QR scanner UI coming soon)
- Event management dashboard

## 🌐 API Endpoints

### Public Endpoints
```
GET  /api/health                    # Health check
GET  /api/events                    # Get all events (with filters)
GET  /api/events/:slug              # Get event by slug
GET  /api/orders/lookup             # Lookup order by ID + email
GET  /api/community/links           # Scrape Linktree community links
POST /api/orders                    # Create order
POST /api/orders/confirm            # Confirm order after payment
POST /api/newsletter                # Newsletter subscription
```

### Admin Endpoints (Require `x-admin-password` header)
```
GET    /api/admin/orders            # Get all orders
GET    /api/admin/events/:id/stats  # Get event statistics
GET    /api/admin/check-in          # Validate ticket
POST   /api/admin/check-in/confirm  # Mark ticket as used
POST   /api/admin/events            # Create event
PUT    /api/admin/events/:id        # Update event
DELETE /api/admin/events/:id        # Delete event
```

## 📧 Email Integration (TODO)

When ready to add email:

1. Choose provider (Resend recommended)
2. Install package: `yarn add resend`
3. Add API key to `.env`
4. Update email sending logic in:
   - Order confirmation
   - Ticket delivery
   - Newsletter subscriptions

## 💳 Stripe Integration (TODO)

When ready to integrate Stripe:

1. Get Stripe keys from dashboard
2. Add to `.env`:
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_SECRET_KEY  
   - STRIPE_WEBHOOK_SECRET
3. Create products and prices in Stripe
4. Update `stripePriceId` in event ticket types
5. Implement Stripe Checkout flow
6. Set up webhook handler for payment confirmation

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` and `/app/app/globals.css` for theme changes.

Default colors:
- Primary: Deep Navy (#0A192F)
- Accent: Amber/Gold (#F59E0B)
- Secondary: Teal (#14B8A6)

### Logo
Replace logo URL in `/app/config/site.js`:
```javascript
logo: 'https://your-logo-url.png'
```

### Content
All page content is in respective page files. Edit directly or create a CMS integration.

## 📱 Mobile Features
- Responsive design (mobile-first)
- Floating WhatsApp button (mobile only)
- Touch-friendly navigation
- Optimized images with Next/Image

## 🔒 Security & GDPR
- Password-protected admin
- GDPR placeholder pages (complete with lawyer)
- Cookie banner ready (add consent management)
- Data minimization in collection
- Secure MongoDB connections

## 🚢 Deployment

### Environment Setup
1. Set all production environment variables
2. Update `NEXT_PUBLIC_BASE_URL`
3. Add real Stripe keys
4. Configure MongoDB Atlas (or production DB)
5. Set strong `ADMIN_PASSWORD`

### Build & Start
```bash
yarn build
yarn start
```

### Recommended Hosting
- Vercel (recommended for Next.js)
- Railway
- DigitalOcean App Platform
- AWS / GCP / Azure

## 📊 Analytics (Recommended)
Add Google Analytics or Plausible:
1. Get tracking ID
2. Add to `layout.js`
3. Track page views and conversions

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Dates**: date-fns
- **QR Codes**: qrcode package
- **Scraping**: Cheerio

## 📞 Support
- Email: info@igkevents.com
- WhatsApp: +491234567890
- Admin issues: Check console logs first

## 🎯 Roadmap
- [ ] Complete Stripe integration
- [ ] Add email service (Resend)
- [ ] QR code scanner UI for check-in
- [ ] Event creation form in admin
- [ ] Advanced analytics dashboard
- [ ] Newsletter management
- [ ] Multi-language support (EN/DE)
- [ ] Social media auto-posting
- [ ] Calendar integrations
- [ ] Referral system

## 📄 License
© 2025 IGK Events. All rights reserved.

---

**Built with ❤️ for the Indian community in Germany**
