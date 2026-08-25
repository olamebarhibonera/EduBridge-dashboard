import { corsHeaders } from '../_shared/cors.ts';

interface TranslateRequest {
  text?: string;
  from?: string;
  to?: string;
}

function parseGoogleResponse(data: unknown): string | null {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
  const translated = data[0]
    .filter((seg: unknown) => Array.isArray(seg) && seg[0])
    .map((seg: unknown[]) => seg[0])
    .join('');
  return translated.trim() || null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as TranslateRequest;
    const text = body.text?.trim();
    const from = body.from || 'auto';
    const to = body.to || 'sw';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing text' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`;

    const googleRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EduBridge/1.0)',
      },
    });

    if (!googleRes.ok) {
      return new Response(
        JSON.stringify({ error: `Google Translate returned ${googleRes.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await googleRes.json();
    const translated = parseGoogleResponse(data);

    if (!translated) {
      return new Response(JSON.stringify({ error: 'Could not parse translation' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ translated, provider: 'google' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
