import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route Segment Config (App Router)
export const maxDuration = 60; // seconds
export const dynamic = 'force-dynamic';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-password',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  try {
    // Check admin password
    const password = request.headers.get('x-admin-password');
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'events'; // events, team, gallery, brands

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: corsHeaders });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size (max 30MB)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 30MB' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert file to buffer then to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: `igkonnekt/${type}`, // Organize by type: igkonnekt/events, igkonnekt/team, etc.
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' }, // Automatic quality optimization
        { fetch_format: 'auto' }, // Automatic format (WebP for supported browsers)
      ],
    });

    return NextResponse.json({
      success: true,
      path: uploadResult.secure_url, // Cloudinary HTTPS URL
      publicId: uploadResult.public_id,
      filename: uploadResult.public_id.split('/').pop(),
      size: file.size,
      type: file.type,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      message: 'File uploaded successfully to Cloudinary'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
