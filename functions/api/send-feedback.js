/**
 * Cloudflare Pages Function - Feedback Handler
 * Logs feedback to console (visible in CF dashboard)
 * Future: Add Discord webhook or email integration
 */

export async function onRequestPost(context) {
  const { request } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
