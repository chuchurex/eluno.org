/**
 * Cloudflare Pages Function - Feedback Handler
 * Sends feedback via email using Mailchannels (free for CF Workers)
 */

export async function onRequestPost(context) {
  const { request } = context;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://lawofone.cl',
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

    // Send email via MailChannels (free for Cloudflare Workers)
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'chuchurex@gmail.com', name: 'Chuchu' }],
          },
        ],
        from: {
          email: 'feedback@lawofone.cl',
          name: 'lawofone.cl Feedback',
        },
        reply_to: email ? { email, name } : undefined,
        subject: `Feedback [${lang.toUpperCase()}] from ${name}`,
        content: [
          {
            type: 'text/plain',
            value: `Name: ${name}\nEmail: ${email || 'Not provided'}\nLanguage: ${lang}\n\nMessage:\n${message}`,
          },
        ],
      }),
    });

    if (emailResponse.ok || emailResponse.status === 202) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    } else {
      const errorText = await emailResponse.text();
      console.error('MailChannels error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Feedback error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://lawofone.cl',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
