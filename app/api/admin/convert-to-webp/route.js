import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

/**
 * API endpoint to convert all Cloudinary PNG/JPG URLs to WebP format
 * This updates the database URLs to include f_webp transformation
 * 
 * POST /api/admin/convert-to-webp
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Add WebP transformation to a Cloudinary URL
 */
function convertToWebp(url) {
  if (!url || typeof url !== 'string') return url;
  
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;
  
  // Skip if already has WebP transformation
  if (url.includes('/f_webp') || url.includes('/f_auto')) return url;
  
  // Add WebP transformation after /upload/
  // f_webp = force WebP format
  // q_auto:good = automatic quality optimization
  const transforms = 'f_webp,q_auto:good';
  
  return url.replace('/upload/', `/upload/${transforms}/`);
}

export async function POST(request) {
  try {
    // Check admin password
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const results = {
      events: { updated: 0, total: 0 },
      team: { updated: 0, total: 0 },
      gallery: { updated: 0, total: 0 },
      brands: { updated: 0, total: 0 },
      testimonials: { updated: 0, total: 0 },
      media: { updated: 0, total: 0 },
      totalUpdated: 0,
    };

    // 1. Update Events
    const events = await db.collection('events').find({}).toArray();
    results.events.total = events.length;
    for (const event of events) {
      let needsUpdate = false;
      const updates = {};
      
      if (event.image && event.image.includes('res.cloudinary.com') && !event.image.includes('/f_webp')) {
        updates.image = convertToWebp(event.image);
        needsUpdate = true;
      }
      if (event.coverImage && event.coverImage.includes('res.cloudinary.com') && !event.coverImage.includes('/f_webp')) {
        updates.coverImage = convertToWebp(event.coverImage);
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await db.collection('events').updateOne({ _id: event._id }, { $set: updates });
        results.events.updated++;
      }
    }

    // 2. Update Team Members (check multiple possible collection names)
    let teamCollection = 'team';
    let team = await db.collection('team').find({}).toArray();
    if (team.length === 0) {
      team = await db.collection('teammembers').find({}).toArray();
      teamCollection = 'teammembers';
    }
    if (team.length === 0) {
      team = await db.collection('team_members').find({}).toArray();
      teamCollection = 'team_members';
    }
    results.team.total = team.length;
    for (const member of team) {
      const imageField = member.image || member.photoUrl || member.photo;
      if (imageField && imageField.includes('res.cloudinary.com') && !imageField.includes('/f_webp')) {
        // Determine which field to update
        const fieldName = member.image ? 'image' : (member.photoUrl ? 'photoUrl' : 'photo');
        await db.collection(teamCollection).updateOne(
          { _id: member._id },
          { $set: { [fieldName]: convertToWebp(imageField) } }
        );
        results.team.updated++;
      }
    }

    // 3. Update Gallery
    const gallery = await db.collection('gallery').find({}).toArray();
    results.gallery.total = gallery.length;
    for (const item of gallery) {
      if (item.image && item.image.includes('res.cloudinary.com') && !item.image.includes('/f_webp')) {
        await db.collection('gallery').updateOne(
          { _id: item._id },
          { $set: { image: convertToWebp(item.image) } }
        );
        results.gallery.updated++;
      }
    }

    // 4. Update Brands
    const brands = await db.collection('brands').find({}).toArray();
    results.brands.total = brands.length;
    for (const brand of brands) {
      // Check both 'logo' and 'logoUrl' fields
      const logoField = brand.logoUrl || brand.logo;
      if (logoField && logoField.includes('res.cloudinary.com') && !logoField.includes('/f_webp')) {
        const updateField = brand.logoUrl ? 'logoUrl' : 'logo';
        await db.collection('brands').updateOne(
          { _id: brand._id },
          { $set: { [updateField]: convertToWebp(logoField) } }
        );
        results.brands.updated++;
      }
    }

    // 5. Update Testimonials (if they have images)
    const testimonials = await db.collection('testimonials').find({}).toArray();
    results.testimonials.total = testimonials.length;
    for (const testimonial of testimonials) {
      if (testimonial.image && testimonial.image.includes('res.cloudinary.com') && !testimonial.image.includes('/f_webp')) {
        await db.collection('testimonials').updateOne(
          { _id: testimonial._id },
          { $set: { image: convertToWebp(testimonial.image) } }
        );
        results.testimonials.updated++;
      }
    }

    // 6. Update Media Coverage
    const media = await db.collection('mediacoverages').find({}).toArray();
    results.media.total = media.length;
    for (const item of media) {
      let needsUpdate = false;
      const updates = {};
      
      if (item.coverImage && item.coverImage.includes('res.cloudinary.com') && !item.coverImage.includes('/f_webp')) {
        updates.coverImage = convertToWebp(item.coverImage);
        needsUpdate = true;
      }
      if (item.publicationLogo && item.publicationLogo.includes('res.cloudinary.com') && !item.publicationLogo.includes('/f_webp')) {
        updates.publicationLogo = convertToWebp(item.publicationLogo);
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await db.collection('mediacoverages').updateOne({ _id: item._id }, { $set: updates });
        results.media.updated++;
      }
    }

    // Calculate total
    results.totalUpdated = 
      results.events.updated + 
      results.team.updated + 
      results.gallery.updated + 
      results.brands.updated + 
      results.testimonials.updated +
      results.media.updated;

    return NextResponse.json({
      success: true,
      message: `Successfully converted ${results.totalUpdated} image URLs to WebP format`,
      details: results,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('WebP conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET endpoint to check current status (how many images need conversion)
export async function GET(request) {
  try {
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const stats = {
      events: { total: 0, needsConversion: 0 },
      team: { total: 0, needsConversion: 0 },
      gallery: { total: 0, needsConversion: 0 },
      brands: { total: 0, needsConversion: 0 },
      media: { total: 0, needsConversion: 0 },
    };

    // Check Events
    const events = await db.collection('events').find({}).toArray();
    stats.events.total = events.length;
    stats.events.needsConversion = events.filter(e => 
      (e.image && e.image.includes('res.cloudinary.com') && !e.image.includes('/f_webp')) ||
      (e.coverImage && e.coverImage.includes('res.cloudinary.com') && !e.coverImage.includes('/f_webp'))
    ).length;

    // Check Team (multiple collection names)
    let teamForCheck = await db.collection('team').find({}).toArray();
    if (teamForCheck.length === 0) {
      teamForCheck = await db.collection('teammembers').find({}).toArray();
    }
    if (teamForCheck.length === 0) {
      teamForCheck = await db.collection('team_members').find({}).toArray();
    }
    stats.team.total = teamForCheck.length;
    stats.team.needsConversion = teamForCheck.filter(t => {
      const imageField = t.image || t.photoUrl || t.photo;
      return imageField && imageField.includes('res.cloudinary.com') && !imageField.includes('/f_webp');
    }).length;

    // Check Gallery
    const gallery = await db.collection('gallery').find({}).toArray();
    stats.gallery.total = gallery.length;
    stats.gallery.needsConversion = gallery.filter(g => 
      g.image && g.image.includes('res.cloudinary.com') && !g.image.includes('/f_webp')
    ).length;

    // Check Brands
    const brands = await db.collection('brands').find({}).toArray();
    stats.brands.total = brands.length;
    stats.brands.needsConversion = brands.filter(b => {
      const logoField = b.logoUrl || b.logo;
      return logoField && logoField.includes('res.cloudinary.com') && !logoField.includes('/f_webp');
    }).length;

    // Check Media
    const media = await db.collection('mediacoverages').find({}).toArray();
    stats.media.total = media.length;
    stats.media.needsConversion = media.filter(m => 
      (m.coverImage && m.coverImage.includes('res.cloudinary.com') && !m.coverImage.includes('/f_webp')) ||
      (m.publicationLogo && m.publicationLogo.includes('res.cloudinary.com') && !m.publicationLogo.includes('/f_webp'))
    ).length;

    const totalNeedsConversion = 
      stats.events.needsConversion + 
      stats.team.needsConversion + 
      stats.gallery.needsConversion + 
      stats.brands.needsConversion +
      stats.media.needsConversion;

    return NextResponse.json({
      message: totalNeedsConversion > 0 
        ? `${totalNeedsConversion} images need WebP conversion`
        : 'All images are already optimized!',
      stats,
      totalNeedsConversion,
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
