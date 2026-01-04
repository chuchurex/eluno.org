/**
 * Cloudflare Pages Function - Feedback Handler
 * Logs feedback to console (visible in CF dashboard)
 * Future: Add Discord webhook or email integration
 */

// Simple in-memory rate limiting (resets when worker restarts)
// For production, consider using Cloudflare KV or D1
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // 3 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count++;
  return false;
}

export async function onRequestPost(context) {
  const { request } = context;

  const allowedOrigins = [
    'https://lawofone.cl',
    'https://www.lawofone.cl'
  ];

  const origin = request.headers.get('Origin');
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Rate limiting check
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(clientIP)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers }
    );
  }

  try {
    const data = await request.json();

    const name = (data.name || '').trim().slice(0, 100);
    const email = (data.email || '').trim().slice(0, 100);
    const message = (data.message || '').trim().slice(0, 5000);
    const lang = (data.lang || 'en').slice(0, 5);

    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: 'Name and message are required' }),
        { status: 400, headers }
      );
    }

    // Log feedback (visible in Cloudflare Pages > Functions > Real-time Logs)
    console.log(JSON.stringify({
      type: 'FEEDBACK',
      timestamp: new Date().toISOString(),
      name,
      email,
      message,
      lang
    }));

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Feedback error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions(context) {
  const { request } = context;

  const allowedOrigins = [
    'https://lawofone.cl',
    'https://www.lawofone.cl'
  ];

  const origin = request.headers.get('Origin');
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
