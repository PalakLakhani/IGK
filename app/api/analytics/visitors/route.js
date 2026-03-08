import { NextResponse } from 'next/server';

/**
 * API endpoint to fetch visitor statistics from Umami Analytics
 * 
 * GET /api/analytics/visitors
 * 
 * Fetches real-time stats from Umami Cloud API (last 24 hours)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const apiToken = process.env.UMAMI_API_TOKEN;
    
    console.log('[Analytics] Fetching stats for websiteId:', websiteId ? 'configured' : 'MISSING');
    console.log('[Analytics] API Token:', apiToken ? 'configured' : 'MISSING');

    // Default stats (will be overwritten if API succeeds)
    let stats = {
      visitors: 0,
      pageviews: 0,
      online: 0,
      source: 'none',
    };

    if (!websiteId || !apiToken) {
      console.error('[Analytics] Missing NEXT_PUBLIC_UMAMI_WEBSITE_ID or UMAMI_API_TOKEN');
      return NextResponse.json({
        ...stats,
        error: 'Missing Umami configuration',
      }, { headers: corsHeaders });
    }

    // Fetch ALL TIME data (from site launch to now)
    const now = new Date();
    // Set start date to January 1, 2020 (or whenever site launched)
    const siteStartDate = new Date('2020-01-01');
    const startAt = siteStartDate.getTime();
    const endAt = now.getTime();

    console.log('[Analytics] Fetching ALL TIME from:', siteStartDate.toISOString(), 'to:', now.toISOString());

    const apiUrl = `https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'x-umami-api-key': apiToken,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable fetch caching
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Analytics] Raw Umami response:', JSON.stringify(data));
      
      stats = {
        visitors: data.visitors?.value ?? data.visitors ?? 0,
        pageviews: data.pageviews?.value ?? data.pageviews ?? 0,
        visits: data.visits?.value ?? data.visits ?? 0,
        bounces: data.bounces?.value ?? data.bounces ?? 0,
        online: 0, // Umami stats endpoint doesn't return active users
        source: 'umami_live',
        lastUpdated: new Date().toISOString(),
      };
    } else {
      const errorText = await response.text();
      console.error('[Analytics] Umami API error:', response.status, errorText);
      stats.error = `API returned ${response.status}: ${errorText}`;
    }

    // Try to get active/online users from the active endpoint
    try {
      const activeResponse = await fetch(
        `https://api.umami.is/v1/websites/${websiteId}/active`,
        {
          headers: {
            'x-umami-api-key': apiToken,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );
      
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        console.log('[Analytics] Active users response:', JSON.stringify(activeData));
        stats.online = activeData.x ?? activeData.active ?? activeData ?? 0;
      }
    } catch (activeError) {
      console.error('[Analytics] Active users error:', activeError);
    }

    return NextResponse.json(stats, { headers: corsHeaders });

  } catch (error) {
    console.error('[Analytics] Fatal error:', error);
    
    return NextResponse.json({
      visitors: 0,
      pageviews: 0,
      online: 0,
      source: 'error',
      error: error.message,
    }, { headers: corsHeaders });
  }
}
